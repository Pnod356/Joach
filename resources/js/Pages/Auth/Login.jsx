import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import LoginButton from '@/Components/LoginButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="grid overflow-hidden rounded-2xl bg-gray-100 shadow-xl lg:grid-cols-2">
                <div className="relative hidden min-h-[620px] overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-600 lg:block">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(13,148,136,0.45),transparent_45%)]" />
                    <img alt="Logo Archidoc" src="/images/Archi.png" className="relative z-10 h-full w-full object-contain p-10" />
                </div>

                <div className="flex items-center justify-center bg-slate-100 px-6 py-10 sm:px-12 lg:px-16">
                    <div className="w-full max-w-md">

                            <img src="/images/logo_dgb.png" alt="Logo DGB" className="mx-auto mb-5 h-28 w-28 object-contain" />

                            <h2 className="mb-8 text-center text-3xl font-semibold text-black">
                                Espace membre | Login
                            </h2>

                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="username" value="Identifiant" />

                                    <TextInput
                                        id="username"
                                        type="text"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />

                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="password" value="Password" />

                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />

                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="mt-4 flex items-center justify-end">

                                    <LoginButton className="w-full items-center justify-center text-center" disabled={processing}>
                                        Connexion
                                    </LoginButton>
                                </div>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white items-center px-2 text-gray-500">
                                            Assistance
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                                <div>

                                    <span className="text-center">
                                        <a
                                            href={route('password.request')}
                                            className="rounded-md text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-900 dark:focus:ring-offset-gray-800"
                                        >
                                            Mot de pass oubli&eacute;? &nbsp;
                                        </a>
                                    </span>

                                    <span className="text-center">
                                        <a
                                            href={route('password.request')}
                                            className="rounded-md text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-900 dark:focus:ring-offset-gray-800"
                                        >
                                            <span className="text-red-500">|</span> Support & Assistance
                                        </a>
                                    </span>
                                </div>
                                <div className="cursor-pointer text-red-500">

                                </div>
                            </div>

                            <div className="flex gap-4 justify-center mt-2 px-2 text-teal-400">
                                <a href="https://www.cinvcorsa.com">
                                    CINVCORSA.
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

        </GuestLayout>
    );
}
