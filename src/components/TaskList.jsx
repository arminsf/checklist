import { useState } from "react";

import { BiChevronDown, BiChevronRight } from "react-icons/bi";

import bocchi from "../assets/bocchi.png";
import ListData from "../data/ListData";
import TaskData from "../data/TaskData";

import Task from "./Task";

function Tasklist({ list, setList, focusedTask, setFocusedTask }) {
  const [doneCollapsed, setDoneCollapsed] = useState(false);
  //const [inFocus] = useState(false);

  const listAll = [...list.displayTasks()];
  const listDone = [...list.displayDoneTasks()];
  const listRemaining = [...list.displayRemainingTasks()];

  function componentDisp(t, i, arr, doneSec) {
    return (
      <Task
        key={t.task.id}
        taskData={t.task}
        indent={t.indent}
        toggleChecked={() => {
          setList(list.toggleDone(t.task.id));
        }}
        toggleCollapsed={() => {
          setList(list.toggleCollapsed(t.task.id));
        }}
        deleteTask={() => {
          setList(list.deleteTask(t.task.id));
        }}
        renameTask={(text) => {
          list.findInChildren(t.task.id).title = text;
          setList(list);
        }}
        addAfter={(str) => {
          const newTask = new TaskData().setTitle(str);
          console.log("1 " + " " + t.task.id)
          console.log(newTask);
          setList(list.addTask(newTask, t.task.id));
          console.log("/1")
          //setFocusedTask(i+1);
        }}
        addInside={(str) => {
          const newTask = new TaskData().setTitle(str);
          t.task.addTask(newTask);
          setList(list);
          //setFocusedTask(i+1);
        }}
        setFocusedTask={(i) => setFocusedTask(i)}
        index={i + doneSec*listRemaining.length}
        listSize={listAll.length}
        focused={(focusedTask === i + doneSec*listRemaining.length)}
      />
    );
  }

  const emptyMessage =
    listAll.length === 0 ? (
      <span className="flex flex-col place-items-center text-gray-400 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
        <img className="max-h-75 shrink-0 aspect-auto" src={bocchi} />
        nothing here...
      </span>
    ) : (
      <></>
    );

  return (
    <div className="relative flex-1 overflow-x-hidden overflow-y-auto flex flex-col">
      {listRemaining.map((t, i, arr) => componentDisp(t, i, arr, 0))}
      <div className="my-4" hidden={listDone.length === 0}>
        <BiChevronDown
          className="absolute left-0 text-2xl text-gray-400 hover:text-gray-500"
          onClick={() => setDoneCollapsed(!doneCollapsed)}
        />
        <BiChevronRight
          className="absolute left-0 text-2xl text-gray-400 hover:text-gray-500"
          onClick={() => setDoneCollapsed(!doneCollapsed)}
        />
        <p className="text-gray-400">done</p>
        <div className="left-[50%] bottom-50% w-full h-px border-gray-400 border-b-1"></div>
      </div>
      {listDone.map((t, i, arr) => componentDisp(t, i, arr, 1))}
      {emptyMessage}
    </div>
  );
}

export default Tasklist;
