import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const todoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    
    setTodos([...todos, todoItem]);
    setNewTodo('');
    // TODO: Save to Firebase Firestore
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    // TODO: Update in Firebase Firestore
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    // TODO: Delete from Firebase Firestore
  };

  return (
    <div className="todo-container">
      <h2>할 일 목록</h2>
      <form onSubmit={handleAddTodo}>
        <input 
          type="text" 
          placeholder="새로운 할 일..." 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
        />
        <button type="submit">추가</button>
      </form>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
