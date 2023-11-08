import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tmdb from "@/util/tmdb";
import { Thunk } from "..";

export enum status {
  IDLE,
  LOADING,
  ERROR,
}

enum sessionType {
  GUEST,
  USER,
}

export interface User {
  session: Session;
  avatar?: { gravatar: { hash?: string }; tmdb: { avatar_path?: string } };
  id?: number;
  username?: string;
}

interface Session {
  id: string;
  type: sessionType;
  expires_at?: string;
}

const initialState: {
  user?: User;
  users: User[];
  status: status;
} = {
  user: undefined,
  users: [],
  status: status.IDLE,
};

function loadUsers(): Thunk {
  return async (dispatch, getState) => {
    dispatch(actions.setStatus(status.LOADING));

    const sessions: Session[] = JSON.parse(
      localStorage.getItem("sessions") || "[]"
    );

    const users = [];
    for (const session of sessions) {
      if (session.type === sessionType.USER) {
        users.push(await loadUserDetails(session));
      } else {
        if (Date.now() < new Date(session.expires_at!).getTime()) {
          users.push({ session });
        } else {
          removeFromStorage(session);
        }
      }
    }
    dispatch(actions.setUsers(users));
    dispatch(actions.setUser(users[0]));

    dispatch(actions.setStatus(status.IDLE));
  };
}

function saveUser(user: User): Thunk {
  return (dispatch, getState) => {
    if (
      !getState()
        .users.users.map((i) => i.session.id)
        .includes(user.session.id) &&
      !getState()
        .users.users.map((i) => i.id)
        .includes(user.id)
    ) {
      dispatch(actions.setUsers(getState().users.users.concat(user)));
      localStorage.setItem(
        "sessions",
        JSON.stringify(getState().users.users.map((i) => i.session))
      );
    }
  };
}

async function loadUserDetails(session: Session) {
  const details = await tmdb.get(`account/account_id?session_id=${session.id}`);

  return {
    session,
    avatar: details.avatar,
    id: details.id,
    username: details.username,
  };
}

function login(request_token: string): Thunk {
  return async (dispatch, getState) => {
    try {
      dispatch(actions.setStatus(status.LOADING));
      const res = await tmdb.post("authentication/session/new", {
        request_token,
      });
      const session = { id: res.session_id, type: sessionType.USER };
      const user = await loadUserDetails(session);
      dispatch(actions.setUser(user));
      dispatch(actions.saveUser(user));
      dispatch(actions.setStatus(status.IDLE));
    } catch (error) {
      dispatch(actions.setStatus(status.ERROR));
    }
  };
}
[{ id: "5d9ff8253300ec7ae8a960e9ad8ef9d9ddedbe69", type: 1 }];

function removeFromStorage(session: Session) {
  const sessions: Session[] = JSON.parse(
    localStorage.getItem("sessions") || "[]"
  );
  localStorage.setItem(
    "sessions",
    JSON.stringify(sessions.filter((i) => i.id !== session.id))
  );
}

function hardLogout(): Thunk {
  return (dispatch, getState) => {
    const newUsers = getState().users.users.filter(
      (i) => i.session.id !== getState().users.user?.session.id
    );

    removeFromStorage(getState().users.user!.session);
    dispatch(actions.setUsers(newUsers));
    dispatch(actions.softLogout());
  };
}

function loginAsGuest(): Thunk {
  return async (dispatch) => {
    try {
      dispatch(actions.setStatus(status.LOADING));
      const res = await tmdb.get("authentication/guest_session/new");
      const session = {
        id: res.guest_session_id,
        type: sessionType.GUEST,
        expires_at: res.expires_at,
      };
      dispatch(actions.setUser({ session }));
      dispatch(actions.saveUser({ session }));
      dispatch(actions.setStatus(status.IDLE));
    } catch (error) {
      dispatch(actions.setStatus(status.ERROR));
    }
  };
}

function switchUser(user: User): Thunk {
  return (dispatch) => {
    dispatch(actions.setUser(user));
  };
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: User }) => {
      state.user = payload;
    },
    setUsers: (state, { payload }: { payload: User[] }) => {
      state.users = payload;
    },
    appendUser: (state, { payload }: { payload: User }) => {
      state.users.push(payload);
    },
    setStatus: (state, { payload }: { payload: status }) => {
      state.status = payload;
    },
    softLogout: (state) => {
      state.user = undefined;
    },
  },
});

export const actions = {
  ...usersSlice.actions,
  loadUsers,
  saveUser,
  login,
  hardLogout,
  loginAsGuest,
  switchUser,
};
export const reducer = usersSlice.reducer;

export const middlewares = [];
