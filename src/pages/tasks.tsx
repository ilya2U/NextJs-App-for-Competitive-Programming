// TaskView.tsx
import CreateTask from "@/components/CreateTask";
import LogOut from "@/components/LogOut";
import NameRes from "@/components/NameRes";
import RecordButton from "@/components/RecordButton";
import TaskList from "@/components/TaskList";
import UserCard from "@/components/UserCard";
import useAuth from "@/hooks/useAuth";

const TaskView = () => {
    const { user } = useAuth();

    return (
        <main className="flex flex-col h-screen p-4">
            <div className="flex justify-between items-center mb-4">
                <UserCard />
                <NameRes />
                <div className="flex space-x-4">
                    <RecordButton />
                    {user && user.username === "admin" && <CreateTask />}
                    <LogOut />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
               <TaskList />
            </div>
        </main>
    );
}

export default TaskView;
