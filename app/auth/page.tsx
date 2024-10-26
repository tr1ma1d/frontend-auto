'use client'

import React, { useState } from 'react';
import style from './form.module.css';
import { useRouter } from 'next/navigation';
import UserApi from '@core/api/users-api';



const Page: React.FC = () => {
  const router = useRouter();
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const toggleForm = (): void => setIsLoginForm(!isLoginForm);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('call handleLogin');
    try {
      // Добавьте здесь логику для отправки данных на сервер
      console.log('Logging in with:', { username, password });
      var user = UserApi.loginUser(username, password);
      router.push('main');
      // router.push('/dashboard'); // пример редиректа после успешного входа
    } catch (err) {
      console.log('Error: not found or inputs are empty');
    }
  };


  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('call addUser');
    try {
      // Добавьте здесь логику для отправки данных на сервер
      console.log('Adding user with:', { username, password, email });
      await UserApi.addUser(username, password, email);
      toggleForm();
      // router.push('/dashboard'); // пример редиректа после успешной регистрации
    } catch (err) {
      console.log('Error: username or email already exists');
    }
  }

  return (
    <div>
      {isLoginForm ? (
        <LoginForm
          toggleForm={toggleForm}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      ) : (
        <RegisterForm
          toggleForm={toggleForm}
          email={email}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          addUser={addUser}
        />
      )}
    </div>
  );
};

interface FormProps {
  toggleForm: () => void;
  username: string;
  password: string;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  handleLogin: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<FormProps> = ({ toggleForm, username, password, setUsername, setPassword, handleLogin }) => {

  return (
    <form onSubmit={handleLogin} className={style["form-container"]}>
      <h2>Вход</h2>
      <div>
        <label>Имя пользователя</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Пароль</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Войти</button>
      <p>
        Нет аккаунта?{' '}
        <button type="button" onClick={toggleForm}>
          Зарегистрироваться
        </button>
      </p>
    </form>
  );
};

interface RegisterFormProps {
  toggleForm: () => void;
  email: string;
  username: string;
  password: string;
  setEmail: (value: string) => void;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  addUser: (e: React.FormEvent) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleForm, email, username, password, setEmail, setUsername, setPassword, addUser }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); addUser(e); }} className={style["form-container"]}>
      <h2>Регистрация</h2>
     
      <div>
        <label>Имя пользователя</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Пароль</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit">Зарегистрироваться</button>
      <p>
        Уже есть аккаунт?{' '}
        <button type="button" onClick={toggleForm}>
          Войти
        </button>
      </p>
    </form>
  );
};


export default Page;
