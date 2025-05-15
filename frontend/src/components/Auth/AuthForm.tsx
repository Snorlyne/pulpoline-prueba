import { useState, useEffect } from "react";
import { login, register } from "../../services/auth.service";
import { useAuth } from "../../hooks/auth.hook";
import { useToastAlert } from "../../hooks/toastAlert.hook";
import { handleAxiosError } from "../../helpers/handleAxiosError";

interface AuthFormProps {
  mode: "login" | "register";
  changeForm: () => void;
  onLoggedIn?: () => void;
}

const initialForm = { username: "", password: "" };
const initialError = { username: "", password: "" };

export default function AuthForm({ mode, changeForm, onLoggedIn }: AuthFormProps) {
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const { showToastAlert } = useToastAlert();
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === "login") {
        const res = await login(form.username, form.password);
        setUser(res.result.username, res.result.token);
        showToastAlert(res.message, "success");
        onLoggedIn?.();
      } else {
        const { message } = await register(form.username, form.password);
        showToastAlert(message, "success");
        changeForm(); // Volver a login tras registro
      }
    } catch (error) {
      const { message } = handleAxiosError(error);
      showToastAlert(message, "danger");
    } finally {
      setForm(initialForm);
      setFormErrors(initialError);
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = { ...initialError };

    if (form.username.length < 3) {
      errors.username = "Username has to be at least 3 characters";
    }

    if (form.password.length < 6) {
      errors.password = "Password has to be at least 6 characters";
    }

    setFormErrors(errors);
    return !errors.username && !errors.password;
  };

  useEffect(() => {
    validateForm();
  }, [form]);

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* Username */}
      <div className="group z-0 relative mb-5 w-full">
        <input
          type="text"
          name="floating_username"
          id="floating_username"
          className="peer block bg-transparent px-0 py-2.5 border-0 border-gray-300 dark:border-gray-600 border-b-2 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 w-full text-gray-900 dark:text-white text-sm appearance-none"
          placeholder=" "
          required
          minLength={3}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <label
          htmlFor="floating_username"
          className="top-3 -z-10 absolute peer-focus:font-medium text-gray-500 dark:text-gray-400 peer-focus:dark:text-blue-500 peer-focus:text-blue-600 text-sm scale-75 peer-focus:scale-75 peer-placeholder-shown:scale-100 origin-[0] -translate-y-6 rtl:peer-focus:translate-x-1/4 peer-focus:-translate-y-6 peer-placeholder-shown:translate-y-0 duration-300 transform peer-focus:start-0"
        >
          Username
        </label>
        {formErrors.username && form.username.length > 0 && (
          <p className="text-red-500">{formErrors.username}</p>
        )}
      </div>

      {/* Password */}
      <div className="group z-0 relative mb-5 w-full">
        <input
          type="password"
          name="floating_password"
          id="floating_password"
          className="peer block bg-transparent px-0 py-2.5 border-0 border-gray-300 dark:border-gray-600 border-b-2 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 w-full text-gray-900 dark:text-white text-sm appearance-none"
          placeholder=" "
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <label
          htmlFor="floating_password"
          className="top-3 -z-10 absolute peer-focus:font-medium text-gray-500 dark:text-gray-400 peer-focus:dark:text-blue-500 peer-focus:text-blue-600 text-sm scale-75 peer-focus:scale-75 peer-placeholder-shown:scale-100 origin-[0] -translate-y-6 rtl:peer-focus:translate-x-1/4 peer-focus:-translate-y-6 peer-placeholder-shown:translate-y-0 duration-300 transform peer-focus:start-0"
        >
          Password
        </label>
        {formErrors.password && form.password.length > 0 && (
          <p className="text-red-500">{formErrors.password}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex sm:flex-row flex-col justify-between">
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center items-center bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 px-5 py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 w-32 font-medium text-white text-sm text-center cursor-pointer"
        >
          {loading ? (
            <div className="border-white border-t-4 rounded-full w-4 h-4 animate-spin"></div>
          ) : mode === "login" ? (
            "Login"
          ) : (
            "Register"
          )}
        </button>
        <button
          type="button"
          onClick={changeForm}
          className="mt-2 sm:mt-0 font-medium text-gray-900 dark:text-gray-300 text-sm hover:underline cursor-pointer"
        >
          {mode === "login"
            ? "You don't have an account? Click here"
            : "Already have an account? Login"}
        </button>
      </div>
    </form>
  );
}
