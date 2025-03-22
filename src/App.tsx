import { createSignal } from "solid-js";

function createSearchSignal(key: string, def: string = "") {
  const init = decodeURIComponent(
    new URL(location.href).searchParams.get(key) ?? def
  );
  const [val, setVal] = createSignal(init);
  const set = (newval: string) => {
    const u = new URL(location.href);
    u.searchParams.set(key, encodeURIComponent(newval));
    history.pushState({}, "", u.toString());
    setVal(newval);
  };
  return { init, val, set };
}
function inp(param: ReturnType<typeof createSearchSignal>) {
  return (ev: InputEvent & { target: HTMLTextAreaElement }) =>
    param.set(ev.target.value);
}

function App() {
  const head = createSearchSignal("h");
  const code = createSearchSignal("c");
  const foot = createSearchSignal("f");
  const byt = new TextEncoder();
  const chr = new Intl.Segmenter("en", { granularity: "grapheme" });
  const charcount = () => [...chr.segment(code.val())].length;
  const bytecount = () => byt.encode(code.val()).length;
  return (
    <div class="font-mono">
      <div class="flex flex-col">
        <label for="head">Header:</label>
        <textarea name="head" id="head" onInput={inp(head)}>
          {head.init}
        </textarea>
        <label for="code">
          Code: ({charcount()} characters, {bytecount()} bytes)
        </label>
        <textarea name="code" id="code" onInput={inp(code)}>
          {code.init}
        </textarea>
        <label for="foot">Footer:</label>
        <textarea name="foot" id="foot" onInput={inp(foot)}>
          {foot.init}
        </textarea>
      </div>
    </div>
  );
}

export default App;
