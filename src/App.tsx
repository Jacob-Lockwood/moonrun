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
      class="bg-blue-700 p-2 text-lg text-sky-300"
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
  const charcount = () => [...chr.segment(code.val())].length;
  const bytecount = () => byt.encode(code.val()).length;
  return (
    <div class="flex min-h-screen bg-blue-400 font-mono">
      <div class="flex w-1/2 flex-col gap-2 p-10">
        <label for="head">Header:</label>
        <Editable id="head" sig={head} />
        <label for="code">
          Code: ({charcount()} characters, {bytecount()} bytes)
        </label>
        <Editable id="code" sig={code} />
        <label for="foot">Footer:</label>
        <Editable id="foot" sig={foot} />
      </div>
      <div class="flex w-1/2 flex-col p-10">
        <h2 class="text-2xl">Run ☾</h2>
      </div>
    </div>
  );
}

export default App;
