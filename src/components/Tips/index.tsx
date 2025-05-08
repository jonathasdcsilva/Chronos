import { useTaskContext } from '../../contexts/TaskContext/useTaskContext'
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';

export function Tips() {
  const { state } = useTaskContext();

  const nextCycle = getNextCycle(state.currentCycle);
  const nextCycleType = getNextCycleType(nextCycle);
  
  // tips
  const tipsForWhenActiveTasks = {
    workTime: <span>Foque por <b>{state.config.workTime} min</b></span>,
    shortBreakTime: <span>Descanse por <b>{state.config.shortBreakTime} min</b></span>,
    longBreakTime: <span>Descanso longo</span>,
  };

  const tipsForNoActiveTasks = {
    workTime: <span>Próximo ciclo é de <b>{state.config.workTime} min</b></span>,
    shortBreakTime: <span>Próximo ciclo é de <b>{state.config.shortBreakTime} min</b></span>,
    longBreakTime: <span>Próximo descanso será longo</span>,
  };  

  return (
    <>
      {!!state.activeTask && tipsForWhenActiveTasks[state.activeTask.type]}
      {!state.activeTask && tipsForNoActiveTasks[nextCycleType]}
    </>
  )
}