import classes from './button.module.scss'

export const Button = ({ text, type, onClick }) => {
    return (
        <div onClick={onClick} className={[classes[type], classes.btn].join(' ')}>
            <p>{text}</p>
        </div>
    )
}
