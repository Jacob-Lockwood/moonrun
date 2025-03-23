import { createSignal } from "solid-js";

function createSearchSignal(key: string, def: string = "") {
  const init = decodeURIComponent(
    new URL(location.href).searchParams.get(key) ?? def,
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
type SearchSignal = ReturnType<typeof createSearchSignal>;
function Editable(props: { sig: SearchSignal; id: string }) {
  return (
    <textarea
      name={props.id}
      id={props.id}
      onInput={(ev) => props.sig.set(ev.target.value)}
      // @ts-ignore
      spellcheck="false"
      class="bg-night-900 selection:bg-night-800 rounded-sm p-2 text-lg text-sky-300 outline-2 outline-indigo-800 focus-visible:outline-indigo-500"
    >
      {props.sig.init}
    </textarea>
  );
}

function App() {
  const head = createSearchSignal("h");
  const code = createSearchSignal("c");
  const foot = createSearchSignal("f");
  const byt = new TextEncoder();
  const chr = new Intl.Segmenter("en", { granularity: "grapheme" });
  const chars = () => Array.from(chr.segment(code.val()), (v) => v.segment);
  const bytecount = () => byt.encode(code.val()).length;
  return (
    <div class="bg-night-950 text-moon-300 flex min-h-screen font-mono">
      <div class="flex w-1/2 flex-col gap-2 p-10">
        <label for="head">Header:</label>
        <Editable id="head" sig={head} />
        <label for="code">
          Code: ({chars().length} characters, {bytecount()} bytes)
        </label>
        <Editable id="code" sig={code} />
        <label for="foot">Footer:</label>
        <Editable id="foot" sig={foot} />
        <button class="w-max cursor-pointer border-4 border-blue-600 bg-blue-500 p-3 text-sky-200 outline-blue-600 transition-colors hover:outline-1">
          Run
        </button>
      </div>
      <div class="flex w-1/2 flex-col p-10">
        <h2 class="text-moon-100 text-2xl">Run ☾</h2>
      </div>
    </div>
  );
}

export default App;
