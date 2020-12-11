import classes from './modal.module.scss'

export const Modal = ({ title, isOpen, onToggle, children, onClickBtn }) => {
    return (
        <div className={[classes.blackout, !isOpen ? classes.hidden : null].join(' ')}>
            <div className={classes.modal}>
                <div className={classes.header}>
                    <p className={classes.title}>{title}</p>
                    <p onClick={onToggle} className={classes.close}>
                        &times;
                    </p>
                </div>
                {children}
                <div className={classes.btns}>
                    <p onClick={onClickBtn} className={classes.btn}>
                        Ок
                    </p>
                    <p onClick={onToggle} className={classes.btn}>
                        Отмена
                    </p>
                </div>
            </div>
        </div>
    )
}
