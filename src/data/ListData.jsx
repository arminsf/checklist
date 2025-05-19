import TaskData from "./TaskData";

class ListData {
    static next_id = Date.now();
  
    constructor(l = null) {
      if (l === null) {
        this.id = crypto.randomUUID();
        this.title = "";
        this.tasks = [];
      } else {
        this.id = l.id;
        this.title = l.title;
        this.tasks = l.tasks.map(t => new TaskData(t));
      }
    }
  
    addSection(title) {
      const newSection = {title: title, tasks: []};
      this.sections = [...this.sections, newSection];
      return newSection;
    }

    setTitle(title) {
      this.title = title;
      return this;
    }
  
    setTasks(tasks) {
      this.tasks = tasks;
      return this;
    }
  
    *displayTasks() {
      for (var t of this.tasks)
        yield* t.displayTasks(0);
    }

    *displayRemainingTasks() {
      for (var t of this.tasks) {
        if (!t.done)
          yield* t.displayTasks(0);
      }
    }

    *displayDoneTasks() {
      for (var t of this.tasks) {
        if (t.done)
          yield* t.displayTasks(0);
      }
    }

    findInChildren(id) {
      for (var t of this.tasks) {
        let x = t.findInChildren(id)
        if (x !== null) return x;
      }

      return null;
    }

    toggleCollapsed(id) {
      this.findInChildren(id).toggleCollapsed();
      return this;
    }

    toggleDone(id) {
      this.findInChildren(id).toggleDone();
      return this;
    }

    addTask(t, after = null) {
      if (after === null) {
        this.tasks.splice(0, 0, t);
        return this;
      } else {
        let i = this.tasks.findIndex(x => x.id === after);
        if (i !== -1) {
          this.tasks.splice(i+1, 0, t);
          return this;
        } else {
          let added = null;
          for (var s of this.tasks) {
            added = s.addTask(t, after);
            if (added !== null) {
              return this;
            } else {
              continue;
            }
          }
        }
      }

      return null;
    }

    deleteTask(id) {
      for (var t of this.tasks) {
        if (t.id === id) {
          this.tasks = this.tasks.filter(x => x !== t);
          break;
        }
        t.deleteTask(id);
      }

      return this;
    }
  }

export default ListData;