export enum ActionTypes {
    SIGNUP_REQUEST_ACTION = 'SIGNUP_REQUEST_ACTION',
    LOGIN_REQUEST_ACTION = 'LOGIN_REQUEST_ACTION',
    LOGOUT_REQUEST_ACTION = 'LOGOUT_REQUEST_ACTION',
    STORE_SESSION_ACTION = 'STORE_SESSION_ACTION',

    STORE_LINKS_ACTION = 'STORE_LINKS_ACTION',
    PERSIST_LINK_ACTION = 'PERSIST_LINK_ACTION',

    GET_BASE_RESOURCES_REQUEST_ACTION = 'GET_BASE_RESOURCES_REQUEST_ACTION',
    GET_ROOT_RESOURCES_REQUEST_ACTION = 'GET_ROOT_RESOURCES_REQUEST_ACTION',
    GET_TODO_RESOURCES_REQUEST_ACTION = 'GET_TODO_RESOURCES_REQUEST_ACTION',
    GET_HISTORY_RESOURCES_REQUEST_ACTION = 'GET_HISTORY_RESOURCES_REQUEST_ACTION',

    LOAD_TODOS_VIEW_ACTION = 'LOAD_TODOS_VIEW_ACTION',
    LOAD_HISTORY_VIEW_ACTION = 'LOAD_HISTORY_VIEW_ACTION',

    GET_LIST_REQUEST_ACTION = 'GET_LIST_REQUEST_ACTION',
    STORE_LIST_ACTION = 'STORE_LIST_ACTION',
    UNLOCK_LIST_REQUEST_ACTION = 'UNLOCK_LIST_REQUEST_ACTION',

    GET_COMPLETED_LIST_REQUEST_ACTION = 'GET_COMPLETED_LIST_REQUEST_ACTION',
    STORE_COMPLETED_LIST_ACTION = 'STORE_COMPLETED_LIST_ACTION',

    STORE_ERRORS_ACTION = 'STORE_ERRORS_ACTION',
    DISMISS_GLOBAL_ALERT_ACTION = 'DISMISS_GLOBAL_ALERT_ACTION',
    CLEAR_ERRORS_ACTION = 'CLEAR_ERRORS_ACTION',

    CREATE_TODO_REQUEST_ACTION = 'CREATE_TODO_REQUEST_ACTION',
    DELETE_TODO_REQUEST_ACTION = 'DELETE_TODO_REQUEST_ACTION',
    DISPLACE_TODO_REQUEST_ACTION = 'DISPLACE_TODO_REQUEST_ACTION',
    UPDATE_TODO_REQUEST_ACTION = 'UPDATE_TODO_REQUEST_ACTION',
    COMPLETE_TODO_REQUEST_ACTION = 'COMPLETE_TODO_REQUEST_ACTION',
    MOVE_TODO_REQUEST_ACTION = 'MOVE_TODO_REQUEST_ACTION',
    PULL_TODOS_REQUEST_ACTION = 'PULL_TODOS_REQUEST_ACTION',
    ESCALATE_TODOS_REQUEST_ACTION = 'ESCALATE_TODOS_REQUEST_ACTION',
}