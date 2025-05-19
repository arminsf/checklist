import TaskData from "./TaskData"
import ListData from "./ListData"

const DummyData = {
  lists: [
    new ListData().setTitle("inbox").setTasks([
    ])
  ],
  listViewed: null,
}

DummyData.listViewed = DummyData.lists[0].id;

export default DummyData;