import styles from './styles.module.css';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';

export function Countdown() {
    const { state } = useTaskContext();
    
    return (
        <div className={styles.container}>
            {state.formattedSecondsRemaining}
        </div>
    );
};