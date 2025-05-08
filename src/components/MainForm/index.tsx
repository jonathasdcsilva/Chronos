import { PlayCircleIcon, StopCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useRef } from 'react';
import { TaskModel } from '../../models/TaskModel';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';
import { Tips } from '../Tips';
import { TimeWorkerManager } from '../../workers/TimeWorkerManager';
import { showMessage } from '../../adapters/showMessage';

export function MainForm() {
  const { state, dispatch } = useTaskContext();
  const taskNameInput = useRef<HTMLInputElement>(null);
  const lastTaskName = state.tasks[state.tasks.length]?.name || '';

  // cycles
  const nextCycle = getNextCycle(state.currentCycle);
  const nextCycleType = getNextCycleType(nextCycle);

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showMessage.dismiss();

    if(taskNameInput.current === null) return;
    const taskName = taskNameInput.current.value.trim();

    if(!taskName) {
      showMessage.warning('Digite o nome da tarefa');
      return;
    }

    const newTask: TaskModel = {
      id: Date.now().toString(),
      name: taskName,
      startDate: Date.now(),
      completeDate: null,
      interruptDate: null,
      duration: state.config[nextCycleType],
      type: nextCycleType
    };

    dispatch({type: TaskActionTypes.START_TASK, payload: newTask});

    const worker = TimeWorkerManager.getInstance();
    worker.terminate();

    showMessage.success('Tarefa iniciada');
  };

  function handleInterruptTask() {
    showMessage.dismiss();
    showMessage.error('Tarefa interrompida');
    dispatch({type: TaskActionTypes.INTERRUPT_TASK});
  };

  return (
      <form onSubmit={handleCreateNewTask} className='form' action=''>
        <div className='formRow'>
          <DefaultInput 
            id='meuInput' 
            type='text' 
            labelText='task' 
            placeholder='Digite a task'
            ref={taskNameInput}
            disabled={!!state.activeTask}
            defaultValue={lastTaskName}
          />
        </div>

        <div className='formRow'>
          <Tips />
        </div>

        {state.currentCycle > 0 && (
          <div className='formRow'>
            <Cycles />
          </div>
        )}

        <div className='formRow'>
          {!state.activeTask && (
            <DefaultButton 
              aria-label='Iniciar nova tarefa' 
              title='Iniciar nova tarefa' 
              type='submit' 
              icon={<PlayCircleIcon />}
              key='BotaoSubmit'
              />
          )}
          {!!state.activeTask && (
            <DefaultButton 
              aria-label='Interromper tarefa atual' 
              title='Interromper tarefa atual' 
              type='button' 
              icon={<StopCircleIcon />}
              color='red'
              onClick={handleInterruptTask}
              key='BotaoNormal'
              />
          )}
        </div>
      </form>
  );
}