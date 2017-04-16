import * as actionTypes from '../constants/actionTypes';

export function getTodosRequestAction(link = {}, scheduling = '') {
	return {
		type: actionTypes.GET_TODOS_REQUEST_ACTION,
		link: link,
		scheduling: scheduling
	}
}

export function getCompletedTodosRequestAction(link = {}) {
	return {
		type: actionTypes.GET_COMPLETED_TODOS_REQUEST_ACTION,
		link: link
	}
}

export function storeTodosAction(todos = [], scheduling = '') {
	return {
		type: actionTypes.STORE_TODOS_ACTION,
		todos: todos,
		scheduling: scheduling
	}
}

export function storeCompletedTodosAction(todos = []) {
	return {
		type: actionTypes.STORE_COMPLETED_TODOS_ACTION,
		todos: todos
	}
}

export function createTodoRequestAction(link = {}, todo = {}, scheduling = '') {
	return {
		type: actionTypes.CREATE_TODO_REQUEST_ACTION,
		link: link,
		todo: todo,
		scheduling: scheduling
	}
}

export function deleteTodoRequestAction(link = {}) {
	return {
		type: actionTypes.DELETE_TODO_REQUEST_ACTION,
		link: link
	}
}

export function moveTodoRequestAction(link = {}) {
	return {
		type: actionTypes.MOVE_TODO_REQUEST_ACTION,
		link: link
	}
}

export function displaceTodoRequestAction(link = {}, todo = {}) {
	return {
		type: actionTypes.DISPLACE_TODO_REQUEST_ACTION,
		link: link,
		todo: todo
	}
}

export function updateTodoRequestAction(link = {}, todo = {}) {
	return {
		type: actionTypes.UPDATE_TODO_REQUEST_ACTION,
		link: link,
		todo: todo
	}
}

export function completeTodoRequestAction(link = {}) {
	return {
		type: actionTypes.COMPLETE_TODO_REQUEST_ACTION,
		link: link
	}
}

export function pullTodosRequestAction(link = {}) {
	return {
		type: actionTypes.PULL_TODOS_REQUEST_ACTION,
		link: link
	}
}
