import { useTeacherAuth } from './hooks/useTeacherAuth';
import { TeacherSelect } from './components/TeacherSelect';
import { ShiftScheduler } from './components/ShiftScheduler';

function App() {
  const { teacherId, selectTeacher, logout } = useTeacherAuth();

  if (!teacherId) {
    return <TeacherSelect onSelect={selectTeacher} />;
  }

  return <ShiftScheduler defaultTeacherId={teacherId} onLogout={logout} />;
}

export default App;
