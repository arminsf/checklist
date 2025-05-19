import { useRef, useEffect } from "react";

import {
  BiCheckbox,
  BiSolidCheckboxChecked,
  BiTrash,
  BiChevronDown,
  BiChevronRight,
} from "react-icons/bi";

function Task({
  taskData,
  indent,
  toggleChecked,
  toggleCollapsed,
  deleteTask,
  renameTask,
  addAfter,
  addInside,
  index,
  listSize,
  setFocusedTask,
  focused,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
      setFocusedTask(null);
    }
  });

  // no idea why tailwind didn't respond to the ml-<numbers> randomly.
  return (
    <div style={{ marginLeft: indent * 24 }}>
      <div
        className={
          "sticky  rounded-lg p-3 flex flex-row place-items-center gap-2 overflow-x-visible" +
          (taskData.done ? " text-gray-400" : "") +
          (document.activeElement === inputRef.current ? " bg-gray-200" : " hover:bg-gray-100")
        }
      >
        <BiCheckbox
          className="absolute left-[18px] text-3xl text-gray-400 hover:text-gray-500"
          onClick={toggleChecked}
          hidden={taskData.done}
        />
        <BiSolidCheckboxChecked
          className="absolute left-[18px] text-3xl text-gray-400 hover:text-gray-500"
          onClick={toggleChecked}
          hidden={!taskData.done}
        />
        <BiChevronDown
          className="absolute left-0 text-2xl text-gray-400 hover:text-gray-500"
          onClick={toggleCollapsed}
          hidden={taskData.collapsed || taskData.subtasks.length === 0}
        />
        <BiChevronRight
          className="absolute left-0 text-2xl text-gray-400 hover:text-gray-500"
          onClick={toggleCollapsed}
          hidden={!taskData.collapsed || taskData.subtasks.length === 0}
        />
        <BiTrash
          className="absolute right-[13px] text-2xl text-gray-400 hover:text-red-400"
          onClick={deleteTask}
        />
        <span hidden className="absolute right-16">{taskData.id}</span>
        <input
          ref={inputRef}
          type="text"
          className="focus:outline-0 w-full h-full focus:text-black relative ml-10 mr-10 wrap-anywhere"
          placeholder="no title"
          value={taskData.title}
          onChange={(e) => renameTask(e.target.value)}
          onClick={() => {
            setFocusedTask(index);
          }}
          onKeyDown={(e) => {
            switch (e.key) {
              case "Enter":
                if (e.ctrlKey) {
                  e.preventDefault();
                  toggleChecked();
                  setFocusedTask(index);
                  break;
                }

                if (!taskData.done) {
                  if (e.shiftKey) {
                    addInside(e.target.value.substring(e.target.selectionEnd));
                    setFocusedTask(index + 1);
                  } else {
                    addAfter(e.target.value.substring(e.target.selectionEnd));
                    setFocusedTask(index + 1 + taskData.sublistHeight());
                  }
                  taskData.title = taskData.title.substring(
                    0,
                    e.target.selectionEnd
                  );
                }

                break;

              case "Delete":
                deleteTask();
                setFocusedTask(Math.min(listSize - 2 - taskData.sublistHeight(), index));
                break;

              case "Backspace":
                if (!taskData.title) {
                  e.preventDefault();
                  taskData.title += " ";
                  deleteTask();
                  setFocusedTask(Math.max(0, index - 1));
                }

                break;

              case "ArrowUp":
                e.preventDefault();
                setFocusedTask((index - 1 + listSize) % listSize);
                break;

              case "ArrowDown":
                e.preventDefault();
                setFocusedTask((index + 1) % listSize);
                break;

              case "Tab":
                e.preventDefault();
                toggleCollapsed();
                break;
            }
          }}
        />
        <div className="absolute left-[50%] -translate-x-1/2 bottom-0 w-9/10 h-px border-gray-200 border-b-1"></div>
      </div>
    </div>
  );
}

export default Task;
