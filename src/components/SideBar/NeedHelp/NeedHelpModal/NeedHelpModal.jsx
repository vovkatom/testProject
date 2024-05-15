import { useState, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { support } from '../../../../redux/user/user-operations';
import Loader from '../../../../components/Loader/Loader';
import css from './need-help-modal.module.css';
import clsx from 'clsx';
import { selectAuthLoading } from '../../../../redux/auth/auth-selectors.js';
import { Notify } from 'notiflix';

const INITIAL_STATE = {
  email: '',
  message: '',
};

const NeedHelpModal = ({ closeModal }) => {
  const [formData, setFormData] = useState({ ...INITIAL_STATE });
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resp = await dispatch(support(formData));
    if (resp.type === 'user/support/fulfilled') {
      Notify.success(
        "You've successfully sent your message to our support. You will get the answer on your email during 48 hours"
      );
    }

    if (resp.error) {
      Notify.failure('Oops, something went wrong. Try again, please');
    }

    reset();
    closeModal();
  };

  const reset = () => {
    setFormData({ ...INITIAL_STATE });
  };

  const emailId = useId();
  const commentsId = useId();

  const { email, message } = formData;

  const inputClassName = clsx(css.modalInput, css.modalControl);
  const textareaClassName = clsx(css.modalInput, css.modalControlText);
  const buttonClassName = clsx(css.modalButton, css.modalControl);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className={inputClassName}
            type="email"
            id={emailId}
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email address"
            required
          />
        </div>
        <div>
          <textarea
            className={textareaClassName}
            id={commentsId}
            name="message"
            value={message}
            onChange={handleChange}
            rows="4"
            placeholder="Comment"
            required
          />
        </div>
        <button className={buttonClassName} type="submit">
          {loading ? <Loader /> : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default NeedHelpModal;
