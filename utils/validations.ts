export const isValidEmail = (email: string) => {
  const match = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  return !!match;
};

export const isEmail = (email: string) => {
  return isValidEmail(email) ? undefined : "El correo no es válido";
};

export const isValidPassword = (password: string) => {
  const match = String(password).match(
    // solo mayusculas
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  );
  return !!match;
};

export const isPassword = (password: string) => {
  return isValidPassword(password)
    ? undefined
    : "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número";
};
