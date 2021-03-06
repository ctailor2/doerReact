export enum ActionTypes {
    SIGNUP_REQUEST_ACTION = 'signup',
    LOGIN_REQUEST_ACTION = 'login',
    LOGOUT_REQUEST_ACTION = 'LOGOUT_REQUEST_ACTION',
    STORE_SESSION_ACTION = 'STORE_SESSION_ACTION',

    STORE_LINKS_ACTION = 'STORE_LINKS_ACTION',
    PERSIST_LINK_ACTION = 'PERSIST_LINK_ACTION',

    GET_BASE_RESOURCES_REQUEST_ACTION = 'baseResources',
    GET_ROOT_RESOURCES_REQUEST_ACTION = 'rootResources',
    GET_LIST_RESOURCES_REQUEST_ACTION = 'listResources',
    GET_HISTORY_RESOURCES_REQUEST_ACTION = 'historyResources',

    LOAD_TODOS_VIEW_ACTION = 'LOAD_TODOS_VIEW_ACTION',
    LOAD_HISTORY_VIEW_ACTION = 'LOAD_HISTORY_VIEW_ACTION',

    GET_LIST_REQUEST_ACTION = 'list',
    CREATE_LIST_ACTION = 'createList',
    STORE_LIST_ACTION = 'STORE_LIST_ACTION',
    UNLOCK_LIST_REQUEST_ACTION = 'unlock',
    GET_LIST_OPTIONS_REQUEST_ACTION = 'lists',
    STORE_LIST_OPTIONS_ACTION = 'STORE_LIST_OPTIONS_ACTION',

    GET_COMPLETED_LIST_REQUEST_ACTION = 'completedList',
    STORE_COMPLETED_LIST_ACTION = 'STORE_COMPLETED_LIST_ACTION',

    STORE_ERRORS_ACTION = 'STORE_ERRORS_ACTION',
    DISMISS_GLOBAL_ALERT_ACTION = 'DISMISS_GLOBAL_ALERT_ACTION',
    CLEAR_ERRORS_ACTION = 'CLEAR_ERRORS_ACTION',

    CREATE_TODO_REQUEST_ACTION = 'createTodo',
    DELETE_TODO_REQUEST_ACTION = 'deleteTodo',
    DISPLACE_TODO_REQUEST_ACTION = 'displaceTodo',
    UPDATE_TODO_REQUEST_ACTION = 'updateTodo',
    COMPLETE_TODO_REQUEST_ACTION = 'completeTodo',
    MOVE_TODO_REQUEST_ACTION = 'moveTodo',
    PULL_TODOS_REQUEST_ACTION = 'pullTodo',
    ESCALATE_TODOS_REQUEST_ACTION = 'escalateTodo',
}
