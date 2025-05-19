class TaskData {
  static next_id = Date.now();

  constructor(t = null) {
    if (t === null) {
      this.id = crypto.randomUUID();
      this.title = "";
      this.time_created = Date.now();
      this.done = false;
      this.collapsed = false;
      this.subtasks = [];
      this.parent = null;
    } else {
      this.id = t.id;
      this.title = t.title;
      this.time_created = t.time_created;
      this.done = t.done;
      this.collapsed = t.collapsed;
      this.subtasks = t.subtasks.map(t => new TaskData(t).setParent(this));
      this.parent = null;
    }
  }

  *displayTasks(i) {
    yield {task: this, indent: i};
    if (!this.collapsed)
      for (var t of this.subtasks)
        yield* t.displayTasks(i + 1);
  }

  findInChildren(id) {
    if (this.id === id) return this;
    for (var t of this.subtasks) {
      let x = t.findInChildren(id)
      if (x !== null) return x;
    }

    return null;
  }

  addTask(t, after = null) {
    if (after === null) {
      this.subtasks.splice(0, 0, t);
      return this;
    } else {
      let i = this.subtasks.findIndex(x => x.id === after);
      if (i !== -1) {
        this.subtasks.splice(i+1, 0, t);
        return this;
      } else {
        let added = null;
        for (var s of this.subtasks) {
          added = s.addTask(t, after);
          if (added !== null) {
            added.setParent(this);
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
    for (var t of this.subtasks) {
      if (t.id === id) {
        this.subtasks = this.subtasks.filter(x => x !== t);
        break;
      }
      t.deleteTask(id);
    }

    return this;
  }

  setSubTasks(subtasks) {
    this.subtasks = subtasks.map(t => t.setParent(this));
    return this;
  }

  setParent(p) {
    this.parent = p;
    return this;
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  toggleDone() {
    this.setDone(!this.done);
    return this;
  }

  setDone(done) {
    this.done = done;

    if (done) {
      this.subtasks.map(t => t.setDone(true));
    }

    if (!done && this.parent !== null) {
      this.parent.setDone(false);
    }

    return this;
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    return this;
  }

  sublistHeight() {
    return !
    this.collapsed && this.subtasks.map(t => 1+t.sublistHeight()).reduce((a, v) => a+v, 0);
  }
}

export default TaskData;