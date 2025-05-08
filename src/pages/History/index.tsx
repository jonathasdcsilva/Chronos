import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

import styles from './styles.module.css'; 
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { formatDate } from '../../utils/formatDate';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { sortTasks, SortTasksOptions } from '../../utils/sortTasks';
import { useEffect, useState } from 'react';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';

export function History() {
  const { state, dispatch } = useTaskContext();
  const hasTasks = state.tasks.length > 0;

  const [ sortedTasksOptions, setSortedTasksOptions] = useState<SortTasksOptions>(() => {
    return { 
      tasks: sortTasks({ tasks: state.tasks }),
      field: 'startDate',
      direction: 'desc',
    };
  });

  useEffect(() => {
    document.title = 'Histórico - Chronos Pomodoro';
  },[]);

  useEffect(() => {
    setSortedTasksOptions(prevState => ({
      ...prevState,
      tasks: sortTasks({ 
        tasks: state.tasks, 
        field: prevState.field,
        direction: prevState.direction,
      }),
    }));
  },[state.tasks]);

  function handleSortTasks({ field }: Pick<SortTasksOptions, 'field'>) {
    const newDirection = sortedTasksOptions.direction === 'desc' ? 'asc' : 'desc';

    setSortedTasksOptions({
      tasks: sortTasks({ tasks: state.tasks, direction: newDirection, field }),
      field,
      direction: newDirection,
    })
  };

  function handleResetHistory() {
    if(!confirm('Deseja excluir o histórico?')) return;

    dispatch({ type: TaskActionTypes.RESET_STATE });
  }
  
  return (
    <MainTemplate>
      <Container>
        <Heading>
          <span>History</span>
          { hasTasks && (
            <span className={styles.buttonContainer}>
              <DefaultButton 
                icon={<TrashIcon />} 
                color='red' 
                aria-label='Apagar todo o histórico' 
                title='Apagar o histórico' 
                onClick={handleResetHistory} />
            </span>
          )}
        </Heading>
      </Container>
      <Container>
        { hasTasks && (
          <div className={styles.responsiveTable}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSortTasks({field: 'name'})} className={styles.thSort}>Tarefa ↕</th>
                  <th onClick={() => handleSortTasks({field: 'duration'})} className={styles.thSort}>Duração ↕</th>
                  <th onClick={() => handleSortTasks({field: 'startDate'})} className={styles.thSort}>Data ↕</th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasksOptions.tasks.map((task) => {
                  const taskTypeDictionary = {
                    workTime: 'Foco',
                    shortBreakTime: 'Descanso curto',
                    longBreakTime: 'Descanso longo',
                  };

                  return (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.duration} min</td>
                      <td>{formatDate(task.startDate)}</td>
                      <td>{getTaskStatus(task, state.activeTask)}</td>
                      <td>{taskTypeDictionary[task.type]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        { !hasTasks && (
          <p style={{textAlign: 'center', fontWeight: 'bold'}}>Não existem tarefas</p>
        )}
      </Container>
    </MainTemplate>
  );
};