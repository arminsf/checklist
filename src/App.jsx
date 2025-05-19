import { useState } from "react";
import { BiPlus, BiReset } from "react-icons/bi";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import TaskData from "./data/TaskData";
import ListData from "./data/ListData";
import DummyData from "./data/DummyData";

import TaskList from "./components/TaskList";

function loadFromStorage() {
  if (!localStorage.getItem("cheklist:data"))
    return DummyData;
  const ld = JSON.parse(localStorage.getItem("cheklist:data"));
  return {
    listViewed: ld.listViewed,
    lists: ld.lists.map(l => new ListData(l))
  };
}

function saveToStorage(data) {
  function serializeTask(t) {
    return {
      id: t.id,
      title: t.title,
      time_created: t.time_created,
      done: t.done,
      collapsed: t.collapsed,
      subtasks: t.subtasks.map(serializeTask)
    };
  }

  const saveData = {
    listViewed: data.listViewed,
    lists: data.lists.map(l => {return {
      id: l.id,
      title: l.title,
      tasks: l.tasks.map(serializeTask)
    }})
  }

  localStorage.setItem("cheklist:data", JSON.stringify(saveData));
}

function App() {
  const [data, setData] = useState(loadFromStorage());
  const [focusedTask, setFocusedTask] = useState(null);

  saveToStorage(data);

  const openList = data.lists.find((l) => l.id === data.listViewed);

  function setList(id, newList) {
    setData((prevData) => {
      const newLists = data.lists.map((l) => {
        if (l.id === id) {
          return new ListData(newList);
        } else {
          return l;
        }
      });

      return { ...prevData, newLists };
    });
  }

  return (
    <div className="w-screen h-screen">
      <PanelGroup autoSaveId="panels" direction="horizontal">
        <Panel defaultSize={19} minSize={12}>
          <Sidebar data={data} setData={setData} />
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={30}>
          <main className="flex-1/3 h-full w-full overflow-x-hidden flex flex-col p-6 gap-5 border-gray-200 border-r-1">
            <div className="w-full h-auto">
              <input type="text" placeholder="no title" className="text-2xl font-bold p-3 focus:outline-0" value={openList.title} 
                onChange={e => {setList(openList.id, openList.setTitle(e.target.value));}} />
              <TaskAdder
                list={openList}
                setList={(l) => {
                  setList(openList.id, l);
                  setFocusedTask(0);
                }}
              />
            </div>
            <TaskList
              list={openList}
              setList={(l) => setList(openList.id, l)}
              focusedTask={focusedTask}
              setFocusedTask={setFocusedTask}
            />
          </main>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={25} minSize={10}>
          <aside className="w-full h-full p-5">
            <ul>
              <li>Enter: New task</li>
              <li>Shift+Enter: New subtask</li>
              <li>Ctrl+Enter: Toggle done</li>
              <li>Tab: Collapse/Expand</li>
            </ul>
          </aside>
        </Panel>
      </PanelGroup>
    </div>
  );
}

function Sidebar({ data, setData }) {
  function switchList(list) {
    setData({ ...data, listViewed: list });
  }

  const sidebarItems = data.lists.map((list) => (
    <List
      key={list.id}
      list={list}
      onClick={switchList}
      focus={data.listViewed === list.id}
    />
  ));

  return (
    <div className="flex flex-col place-items-center w-full h-full overflow-x-hidden overflow-y-auto border-gray-200 border-r-1 p-5">
      {sidebarItems}
    
      <button className="bg-gray-100 w-auto px-5 rounded-b-lg text-gray-400 hover:bg-gray-200  hover:text-gray-400"
        onClick={() => {setData(prevData => {return {...prevData, lists:[...prevData.lists, new ListData()]}})}}
      >
        add list
      </button>

      <button
        className="flex gap-1 text-gray-400 hover:text-red-400 absolute place-items-center bottom-1 left-1"
        onClick={() => {setData(DummyData);}}
      >
        <BiReset className="text-2xl" /> {localStorage.getItem("cheklist:data") ? "reset local data" : "no local data"}
      </button>
    </div>
  );
}

function List({ list, onClick, focus }) {
  return (
    <button
      className={
        "relative wrap-anywhere rounded-lg p-3 w-full" +
        (focus ? " bg-gray-200 hover:bg-gray-200" : " hover:bg-gray-100") +
        (!list.title ? " text-gray-400" : "")
      }
      onClick={() => onClick(list.id)}
    >
      {list.title || "no title"}
      <span className="absolute right-3 text-gray-400">
        {list.tasks.filter((t) => t.done).length}/{list.tasks.length}
      </span>
    </button>
  );
}

function TaskAdder({ list, setList }) {
  const [title, setTitle] = useState("");

  function addTask() {
    if (title === "") return;

    setList(list.addTask(new TaskData().setTitle(title)));

    setTitle("");
  }

  return (
    <div className="relative w-full">
      <BiPlus
        className="absolute left-2.5 top-[50%] -translate-y-1/2 text-gray-400 text-2xl"
        hidden={title !== ""}
      />
      <input
        className="w-full rounded-full p-3 bg-gray-100 focus:bg-white"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") addTask();
        }}
        type="text"
        placeholder="      add task"
      />
    </div>
  );
}

export default App;
