#!/usr/bin/env python3
"""Dev server for the game: no caching, and pages reload themselves when a file changes.

    python3 tools/serve.py [--port 8102]

- Every response is sent with Cache-Control: no-store, so edits always show up.
- index.html gets a tiny reload script injected (the game files themselves stay untouched).
  The page reloads shortly after any file in the game folder changes, including a
  `git switch` to another group's branch.
- index.html?selftest gets the self-check runner instead (see tools/selftest.js).
- Dotfiles (.git, .claude) are not served.
"""
import argparse, os, sys, threading, time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(TOOLS)

RELOAD_JS = b"""<script>/* dev auto-reload (injected by tools/serve.py) */
(function(){var first=null;function go(){var es=new EventSource('/__dev/events');
es.onmessage=function(e){if(first===null)first=e.data;else if(e.data!==first)location.reload();};}go();})();
</script>"""

SELFTEST_HEAD = b"""<script>/* error catcher (injected by tools/serve.py) */
window.__errors=[];addEventListener('error',function(e){__errors.push(String(e.message||e)+(e.filename?' @ '+e.filename.split('/').pop()+':'+e.lineno:''));});
addEventListener('unhandledrejection',function(e){__errors.push('Unhandled promise: '+String(e.reason&&e.reason.stack||e.reason));});
</script>"""


def snapshot():
    """A stamp that changes whenever any served file is added, removed or modified."""
    newest, count = 0.0, 0
    for d, dirs, files in os.walk(ROOT):
        dirs[:] = [x for x in dirs if not x.startswith(".") and os.path.join(d, x) != TOOLS]
        for f in files:
            if f.startswith("."):
                continue
            try:
                newest = max(newest, os.stat(os.path.join(d, f)).st_mtime)
                count += 1
            except OSError:
                pass
    return f"{newest:.3f}-{count}"


class State:
    stamp = snapshot()
    cond = threading.Condition()


def watcher():
    pending, since = None, 0.0
    while True:
        time.sleep(0.25)
        s = snapshot()
        if s != State.stamp and s != pending:
            pending, since = s, time.time()        # change seen: wait for edits to settle
        elif pending and s == pending and time.time() - since > 0.4:
            with State.cond:
                State.stamp, pending = s, None
                State.cond.notify_all()
        elif pending and s == State.stamp:
            pending = None


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        if not self.path.startswith("/__dev/events"):
            sys.stderr.write("%s\n" % (fmt % args))

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        url = urlsplit(self.path)
        parts = [p for p in url.path.split("/") if p]
        if any(p.startswith(".") for p in parts):
            return self.send_error(404)
        if url.path == "/__dev/events":
            return self.events()
        if url.path == "/__dev/selftest.js":
            return self.send_file(os.path.join(TOOLS, "selftest.js"), "text/javascript")
        if url.path in ("/", "/index.html"):
            return self.index(any(k in url.query for k in ("selftest", "look", "pictures")))
        return super().do_GET()

    def send_file(self, path, ctype, body=None):
        if body is None:
            with open(path, "rb") as f:
                body = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def index(self, selftest):
        with open(os.path.join(ROOT, "index.html"), "rb") as f:
            html = f.read()
        if selftest:  # selftest, look or pictures
            i = html.find(b"<body>")
            html = (html[: i + 6] + SELFTEST_HEAD + html[i + 6 :]) if i >= 0 else SELFTEST_HEAD + html
            tail = b'<script src="/__dev/selftest.js"></script>'
        else:
            tail = RELOAD_JS
        j = html.rfind(b"</body>")
        html = html[:j] + tail + html[j:] if j >= 0 else html + tail
        self.send_file(None, "text/html; charset=utf-8", html)

    def events(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.end_headers()
        try:
            last = State.stamp
            self.wfile.write(f"data: {last}\n\n".encode()); self.wfile.flush()
            while True:
                with State.cond:
                    State.cond.wait(timeout=15)
                    now = State.stamp
                if now != last:
                    last = now
                    self.wfile.write(f"data: {now}\n\n".encode())
                else:
                    self.wfile.write(b": ping\n\n")
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8102)
    ap.add_argument("--bind", default="127.0.0.1")
    ap.add_argument("--no-watch", action="store_true", help="skip the file watcher (used by tools/check.sh)")
    args = ap.parse_args()
    if not args.no_watch:
        threading.Thread(target=watcher, daemon=True).start()
    ThreadingHTTPServer.daemon_threads = True
    srv = ThreadingHTTPServer((args.bind, args.port), Handler)
    print(f"Serving {ROOT} at http://localhost:{args.port}/ (no cache, auto-reload)", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
