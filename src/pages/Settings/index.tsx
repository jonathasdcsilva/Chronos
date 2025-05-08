import { SaveIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';
import { useEffect, useRef } from 'react';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { showMessage } from '../../adapters/showMessage';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';

export function Settings() {
  const { state, dispatch } = useTaskContext();
  const workTimeInputRef = useRef<HTMLInputElement>(null);
  const shortBreakTimeInputRef = useRef<HTMLInputElement>(null);
  const longBreakTimeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      document.title = 'Configurações - Chronos Pomodoro';
    },[]);
  
  function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    const listErrors = [];

    const workTime = Number(workTimeInputRef.current?.value);
    const shortBreakTime = Number(shortBreakTimeInputRef.current?.value);
    const longBreakTime = Number(longBreakTimeInputRef.current?.value);

    if(isNaN(workTime) || isNaN(shortBreakTime) || isNaN(longBreakTime)) {
      listErrors.push('Digite apenas números.');
    }

    if(workTime <= 0 || workTime > 99) {
      listErrors.push('Tempo de foco não pode ser inferior à zero ou maior que 99');
    }

    if(shortBreakTime <= 0 || shortBreakTime > 99) {
      listErrors.push('Tempo de descanso curto não pode ser inferior à zero ou maior que 99');
    }

    if(longBreakTime <= 0 || longBreakTime > 99) {
      listErrors.push('Tempo de descanso longo não pode ser inferior à zero ou maior que 99');
    }

    if(listErrors.length > 0) {
      listErrors.forEach(item => showMessage.error(item));
      return;
    }

    dispatch({ 
      type: TaskActionTypes.CHANGE_SETTINGS, 
      payload: { 
        workTime, 
        shortBreakTime, 
        longBreakTime
      }
    });

    showMessage.success('Configurações salvas com sucesso.');
  }
  return (
    <MainTemplate>
      <Container>
        <Heading>
          Configurações
        </Heading>
      </Container>

      <Container>
        <p style={{ textAlign: 'center' }}>
          Alterar configurações de tempo
        </p>
      </Container>

      <Container>
        <form onSubmit={handleSaveSettings} action='' className='form'>
          <div className='formRow'>
            <DefaultInput 
              id='workTime' 
              labelText='Foco' 
              ref={workTimeInputRef} 
              defaultValue={state.config.workTime} 
              type='number'
            />
          </div>
          <div className='formRow'>
            <DefaultInput 
              id='shortBreakTime' 
              labelText='Descanso curto' 
              ref={shortBreakTimeInputRef} 
              defaultValue={state.config.shortBreakTime}
              type='number'
            />
          </div>
          <div className='formRow'>
            <DefaultInput 
              id='longBreakTime' 
              labelText='Descanso longo' 
              ref={longBreakTimeInputRef} 
              defaultValue={state.config.longBreakTime}
              type='number'
            />
          </div>
          <div className='formRow'>
            <DefaultButton icon={<SaveIcon />} aria-label='Salvar configurações' title='Salvar configurações' />
          </div>
        </form>
      </Container>
    </MainTemplate>
  );
};