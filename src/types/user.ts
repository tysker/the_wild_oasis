export type LoginProps = {
  email: string;
  password: string;
};

export type UserProps = {
  user: {
    id: string;
    aud: string;
    display_name: string;
    email: string;
    phone?: string;
  };
};
