import InputLabel from '@/Components/InputLabel'
import Sidebar from '@/Components/Sidebar'
import SubmitButton from '@/Components/SubmitBtn'
import Textarea from '@/Components/Textarea'
import TextInput from '@/Components/TextInput'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useForm, usePage } from '@inertiajs/react'
import {
    CheckCircle2,
    SkipBack,
    SkipForward,
    Edit3Icon,
    UserSquare2Icon,
    CreditCardIcon,
    Notebook
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/Components/ui/card'
import TabArchives from './TabArchives'
import { toast, Toaster } from 'sonner'
import { CloseButton } from '@headlessui/react'

export default function TypeArchives({ types, groupes, locations }) {
    const [ currentStep, setCurrentStep ] = useState(1);
    const [ archiveSearch, setArchiveSearch ] = useState('');
    const [ isArchiveOpen, setIsArchiveOpen ] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        typearchive: '',
        date_doc: '',
        description: '',
        format: '',
        emplacement: '',
        emplacement2: '',
        rayon: '',
        travee: '',
        cote: '',
        departement: '',
        filepath: null
    });

    const user = usePage().props.auth.user;

    useEffect(() => {
        if (data.typearchive) {
            setArchiveSearch(data.typearchive);
        } else {
            setArchiveSearch('');
        }
    }, [data.typearchive]);

    const filteredTypes = (types || []).filter((role) =>
        role.intitule?.toLowerCase().includes(archiveSearch.toLowerCase())
    );

    const handleArchiveSelect = (value) => {
        setData('typearchive', value);
        setArchiveSearch(value);
        setIsArchiveOpen(false);
    };

    // Filtrer les groupes selon le rôle de l'utilisateur
    const filteredGroupes = user?.roles === 'Super'
        ? groupes
        : groupes.filter(group => group.sigle === user?.departement);

    const nextStep = () => {
        // Si format est "Document Papier", ne pas avancer à l'étape suivante
        if (currentStep === 1 && data.format === 'Document Papier') {
            return;
        }
        setCurrentStep((prev) => prev + 1);
    }

    const prevStep = () => {
        setCurrentStep((prev) => prev - 1);
    }

    const handleStep1Submit = (e) => {
        e.preventDefault();
        // Si format est "Document Papier", soumettre directement le formulaire
        if (data.format === 'Document Papier') {
            submit(e);
        } else {
            nextStep();
        }
    }

    const handleFileChange = (e) => {
        // Set the file object to the form data
        const file = e.target.files[0];

        if (file && file.type === 'application/pdf') {
            setData('filepath', file);
        } else {
            alert('Veuillez sélectionner un fichier PDF.');
            e.target.value = null; // Clear the input
            return;
        }
    };

    const submit = (e) => {
        e.preventDefault();

        toast("Archive créée avec succès.", {
            type: "success",
            action: {
                label: <CloseButton />
            }
        })

        post(route('archives.store'), {
            forceFormData: true,
            onFinish: () => reset('typearchive', 'date_doc', 'description', 'format', 'emplacement', 'emplacement2', 'rayon', 'travee', 'cote', 'departement, filepath'),
        });
    };

  return (
    <AuthenticatedLayout>

        <div className='flex flex-row gap-4'>

            <div className="basis-1/4">
                <Sidebar />
            </div>

            <div className="basis-3/4 mr-24 lg:mr-24 md:mr-24 sm:mr-10 py-6">
                <div className="mx-auto max-w-11xl sm:px-6 lg:px-88">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-100">
                        <div className="p-6 border-sky-200 creation-title font-bold">
                            Nouvelle archive
                        </div>

                        <form onSubmit={submit}>

                            { currentStep === 1 && (
                                <div>
                                    {data.format !== 'Document Papier' && (
                                        <div className="p-6 border-sky-200 font-bold">
                                            Étape 1/3: Creation d'une archive
                                        </div>
                                    )}

                                    <div className='mx-8 gap-4'>
                                        <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
                                            <Label htmlFor="format">
                                                Format du document:
                                                <span className="text-red-500">
                                                    &nbsp;*
                                                </span>
                                            </Label>
                                            <Select
                                                defaultValue="Document PDF"
                                                name="format"
                                                // Use the `onValueChange` prop to update Inertia's form data
                                                onValueChange={(value) => setData('format', value)}
                                                // Set the currently selected value based on the form data
                                                value={data.format}
                                            >
                                                <SelectTrigger id="format">
                                                    <SelectValue placeholder="Format Document" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Document PDF">Document PDF</SelectItem>
                                                    <SelectItem value="Image">Image</SelectItem>
                                                    <SelectItem value="Document Papier">Document Papier</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='mx-8 py-2  gap-4'>
                                        <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)] relative">
                                            <Label htmlFor="typearchive">
                                                Type d'archives:
                                                <span className="text-red-500">
                                                    &nbsp;*
                                                </span>
                                            </Label>

                                            <div className="relative">
                                                <Input
                                                    id="typearchive"
                                                    type="text"
                                                    value={archiveSearch}
                                                    placeholder="Selectionner le type d'archive..."
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => {
                                                        setArchiveSearch(e.target.value);
                                                        setIsArchiveOpen(true);
                                                    }}
                                                    onFocus={() => setIsArchiveOpen(true)}
                                                />

                                                {isArchiveOpen && (
                                                    <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                                                        {filteredTypes.length > 0 ? (
                                                            filteredTypes.map((role) => (
                                                                <li key={role.id}>
                                                                    <button
                                                                        type="button"
                                                                        className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-sky-50"
                                                                        onMouseDown={(e) => e.preventDefault()}
                                                                        onClick={() => handleArchiveSelect(String(role.intitule))}
                                                                    >
                                                                        {role.intitule}
                                                                    </button>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="px-3 py-2 text-sm text-gray-500">
                                                                Aucun type correspondant
                                                            </li>
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                            {errors.typearchive && <p className="text-red-500 text-sm mt-1">{errors.typearchive}</p>}

                                        </div>
                                    </div>

                                    <div className="mx-8 py-2 w-90">
                                        <div className="inline-flex relative">
                                            <InputLabel htmlFor="description" value="Objet de l'archive (Nombre limite de caractère 30):"/>
                                            <span className="text-red-500">
                                                &nbsp;*
                                            </span>
                                        </div>

                                        <Textarea
                                            id="description"
                                            type="text"
                                            name="description"
                                            value={data.description}
                                            className="mt-1 block w-full"
                                            autoComplete="description"
                                            isFocused={true}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                    </div>

                                    <div className="mx-8 py-2 w-90">
                                        <div className="inline-flex relative">
                                            <InputLabel htmlFor="date_doc" value="Date signature:"/>
                                            <span className="text-red-500">
                                                &nbsp;*
                                            </span>
                                        </div>

                                        <TextInput
                                            id="date_doc"
                                            type="date"
                                            name="date_doc"
                                            value={data.date_doc}
                                            className="mt-1 block w-full"
                                            autoComplete="date_doc"
                                            isFocused={true}
                                            onChange={(e) => setData('date_doc', e.target.value)}
                                        />
                                    </div>

                                    { user?.roles !== 'User' && (
                                    <div className="flex flex-row py-2 mx-8 gap-4">

                                        <div className='basis-1/2'>
                                            <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
                                                <Label htmlFor="emplacement">
                                                    Emplacement Physique:
                                                    <span className="text-red-500">
                                                        &nbsp;*
                                                    </span>
                                                </Label>

                                                <Select
                                                    // Use the `onValueChange` prop to update Inertia's form data
                                                    onValueChange={(value) => setData('emplacement', value)}
                                                    // Set the currently selected value based on the form data
                                                    value={data.emplacement}
                                                    >
                                                    <SelectTrigger id="emplacement">
                                                        {/* The SelectValue displays the currently selected item's text */}
                                                        <SelectValue placeholder="Selectionner l'emplacement physique..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {locations.map((role) => (
                                                            <SelectItem key={role.id} value={String(role.magasin)}>
                                                                {role.magasin}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.emplacement && <p className="text-red-500 text-sm mt-1">{errors.emplacement}</p>}

                                            </div>
                                        </div>

                                        <div className="basis-1/2">
                                            <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
                                                <Label htmlFor="emplacement2">
                                                    Emplacement Virtuel:
                                                    <span className="text-red-500">
                                                        &nbsp;*
                                                    </span>
                                                </Label>
                                                <Select
                                                    defaultValue="Serveur"
                                                    name="emplacement2"
                                                    // Use the `onValueChange` prop to update Inertia's form data
                                                    onValueChange={(value) => setData('emplacement2', value)}
                                                    // Set the currently selected value based on the form data
                                                    value={data.emplacement2}
                                                >
                                                    <SelectTrigger id="emplacement2">
                                                        <SelectValue placeholder="Emplacement Document" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Serveur">Serveur</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    )}

                                    { user?.roles !== 'User' && (
                                    <div className="flex flex-row py-2 mx-8 gap-4">
                                        <div className="basis-1/2">
                                            <div className="inline-flex relative">
                                                <InputLabel htmlFor="rayon" value="Rayon:"/>
                                            </div>

                                            <TextInput
                                                id="rayon"
                                                type="text"
                                                name="rayon"
                                                value={data.rayon}
                                                className="mt-1 block w-full"
                                                autoComplete="rayon"
                                                isFocused={true}
                                                onChange={(e) => setData('rayon', e.target.value)}
                                            />
                                        </div>
                                        <div className="basis-1/2">
                                            <div className="inline-flex relative">
                                                <InputLabel htmlFor="travee" value="Travée:"/>
                                            </div>

                                            <TextInput
                                                id="travee"
                                                type="text"
                                                name="travee"
                                                value={data.travee}
                                                className="mt-1 block w-full"
                                                autoComplete="travee"
                                                isFocused={true}
                                                onChange={(e) => setData('travee', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    )}

                                    <div className="mx-8 py-2 gap-4">
                                        <div className="inline-flex relative">
                                            <InputLabel htmlFor="cote" value="Cote de boite d'archives:"/>
                                        </div>

                                        <TextInput
                                            id="cote"
                                            type="text"
                                            name="cote"
                                            value={data.cote}
                                            className="mt-1 block w-full"
                                            autoComplete="cote"
                                            isFocused={true}
                                            onChange={(e) => setData('cote', e.target.value)}
                                            placeholder="Cote de boite d'archives"
                                        />
                                    </div>

                                    <div className='mx-8 py-2 gap-4'>
                                        <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
                                            <Label htmlFor="departement">
                                                Groupe d'accès:
                                                <span className="text-red-500">
                                                    &nbsp;*
                                                </span>
                                            </Label>

                                            <Select
                                                // Use the `onValueChange` prop to update Inertia's form data
                                                onValueChange={(value) => setData('departement', value)}
                                                // Set the currently selected value based on the form data
                                                value={data.departement}
                                                >
                                                <SelectTrigger id="departement">
                                                    {/* The SelectValue displays the currently selected item's text */}
                                                    <SelectValue placeholder="Selectionner le Groupe d'accès..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredGroupes.map((role) => (
                                                        <SelectItem key={role.id} value={String(role.sigle)}>
                                                            {role.sigle}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.role_id && <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>}

                                        </div>
                                    </div>

                                    <div className="mx-8 py-4 w-90">
                                        <span className="italic">
                                            <span className="text-red-500">(*)</span> Tous les champs sont obligatoires
                                        </span>
                                    </div>

                                    <div className="flex flex-row py-2 my-4 mx-8 gap-4">
                                        <div className="">
                                            <SubmitButton onClick={handleStep1Submit}>
                                                {data.format === 'Document Papier' ? (
                                                    <>
                                                        <CheckCircle2 size={20}/> &nbsp;&nbsp;Valider
                                                    </>
                                                ) : (
                                                    <>
                                                        Suivant &nbsp;&nbsp;<SkipForward size={20}/>
                                                    </>
                                                )}
                                            </SubmitButton>
                                        </div>
                                    </div>
                                </div>
                            )}

                            { currentStep === 2 && (
                                <div className='my-4'>
                                    <div className="p-6 border-sky-200 font-bold">
                                        Étape 2/3: Importation du document
                                    </div>

                                    <div className='py-4 mx-auto p-6'>
                                        <Notebook className='w-5 h-5'/> { data.description }
                                    </div>

                                    <div className='mx-8 py-4 gap-4'>
                                        <Label htmlFor="file">Importer le fichier (document)</Label>
                                        <Input
                                            id="file"
                                            name='filepath'
                                            type="file"
                                            accept=".pdf" // Restrict to PDF files in the browser
                                            onChange={handleFileChange}
                                        />

                                        {
                                            errors.filepath && <div> { errors.filepath } </div>
                                        }
                                    </div>

                                    <div className="flex flex-row py-2 my-4 mx-8 gap-4">
                                        <div className=" basis-1/2">
                                            <SubmitButton onClick={prevStep}>
                                                <SkipBack size={20}/> &nbsp;&nbsp;Precedent
                                            </SubmitButton>
                                        </div>
                                        <div className="basis-1/2 flex justify-end">
                                            <SubmitButton onClick={nextStep}>
                                                Suivant &nbsp;&nbsp;<SkipForward size={20}/>
                                            </SubmitButton>
                                        </div>
                                    </div>
                                </div>
                            )}

                            { currentStep === 3 && (
                                <div className='my-4'>
                                    <div className="p-6 border-sky-200 font-bold">
                                        Étape 3/3: Validation des données
                                    </div>

                                    <div className='py-4 mx-auto p-6'>
                                        <Notebook className='w-5 h-5'/> { data.description }
                                    </div>

                                    <div className='flex flex-row py-2 my-4 gap-4'>
                                        <div className="basis-1/4 mx-8">
                                            <strong>Type d'archive:</strong> { data.typearchive }
                                            <br />
                                            <strong>Date de signature:</strong> { data.date_doc }
                                            <br />
                                            <strong>Format du document:</strong> { data.format }
                                            <br />
                                            <strong>Emplacement Physique:</strong> { data.emplacement }
                                            <br />
                                            <strong>Emplacement Virtuel:</strong> { data.emplacement2 }
                                            <br />
                                            <strong>Rayon:</strong> { data.rayon }
                                            <br />
                                            <strong>Travée:</strong> { data.travee }
                                            <br />
                                            <strong>Cote de boite d'archives:</strong> { data.cote }
                                            <br />
                                            <strong>Groupe d'accès:</strong> { data.departement }
                                        </div>
                                        <div className="basis-3/4 mx-8">
                                            <div className="aspect-[3/4] w-full border border-gray-300 rounded-lg overflow-hidden">
                                                {/* Use an iframe for native browser PDF preview.
                                                    The 'type="application/pdf"' and 'height/width' attributes are important.
                                                */}
                                                <iframe
                                                    src={data.filepath ? URL.createObjectURL(data.filepath) : ''}
                                                    title="Aperçu du document PDF"
                                                    width="100%"
                                                    height="100%"
                                                    type="application/pdf"
                                                    className="w-full h-full"
                                                    style={{ border: 'none' }}
                                                >
                                                    {/* Fallback content for browsers that can't render the iframe */}
                                                    <p>Your browser does not support PDF viewing. <a href={data.filepath} target="_blank" rel="noopener noreferrer">Download the PDF</a> instead.</p>
                                                </iframe>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="flex flex-row py-2 my-4 mx-8 gap-4">
                                        <div className="basis-1/2">
                                            <SubmitButton onClick={prevStep}>
                                                <SkipBack size={20}/> &nbsp;&nbsp;Precedent
                                            </SubmitButton>
                                        </div>
                                        <div className="basis-1/2 flex justify-end">
                                            <SubmitButton>
                                                <CheckCircle2 size={20}/> &nbsp;&nbsp;Valider
                                            </SubmitButton>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
  )
}
