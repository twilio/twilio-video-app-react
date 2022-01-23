import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useFormContext, FormProvider, useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { getStorage } from 'utils/firebase/storage';
import { XIcon, CheckIcon } from '@heroicons/react/solid';
import { FormContext } from 'twilio/lib/rest/verify/v2/form';
import { randomString } from 'utils/string';
import { Alert } from 'components/Alert';
import cn from 'classnames';
import { TCategoryStore, TTagStore } from 'types/CategoryDeck';
import { createSession } from 'utils/firebase/session';
import { PlusIcon } from '@heroicons/react/outline';
import { title } from 'process';

const H1 = (props: { children: string }) => <h1 className="text-xl text-center font-medium">{props.children}</h1>;
const H2 = (props: { children: string }) => <h2 className="">{props.children}</h2>;

const Input = (props: { type: string; placeholder?: string; id: string }) => {
  const { register } = useFormContext();

  return (
    <input
      className="focus:ring-purple focus:border-purple block w-full sm:text-sm border-purple rounded-md px-5 py-5 shadow-xl"
      {...register(props.id)}
      placeholder={props.placeholder}
      type={props.type}
    />
  );
};

const TitledInput = (props: {
  id: string;
  children: string;
  required?: boolean;
  placeholder?: string;
  type: string;
}) => {
  const { register } = useFormContext();

  if (!props.id) {
    throw new Error('Input id undefined!');
  }

  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        <span>{props.children}</span>
        {props.required ? <span className="text-red">*</span> : <span className="pl-1">(optional)</span>}
      </label>
      <div className="mt-1">
        <Input id={props.id} placeholder={props.placeholder} type={props.type} />
      </div>
    </div>
  );
};

export const CreateSession = () => {
  const form = useForm();
  const [categories, setCategories] = useState<TCategoryStore>({});
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [shareTokens, setShareTokens] = useState<Record<string, string> | undefined>();
  const [shareTokenFile, setShareTokenFile] = useState<string>();
  const [sessionDocId, setSessionDocId] = useState<string>();

  const submit: SubmitHandler<FieldValues> = (data: Record<string, any>) => {
    if (data.logo.length === 1) {
      const logo = data.logo[0] as File;
      const id = '' + Math.round(Math.random() * 100000000000) + Math.round(Math.random() * 100000000000);

      getStorage().then(storage => {
        storage
          .ref(`/host-logos/${id}`)
          .put(logo)
          .on(
            'state_changed',
            e => {
              console.log(e);
              if (e.bytesTransferred === e.totalBytes) {
                createSession(data.title, categories, id).then(response => {
                  setShareTokens(response.shareTokens);
                  setSessionDocId(response.sessionDocId);
                });
              }
            },
            console.error
          );
      });
    } else {
      createSession(data.title, categories).then(response => {
        setShareTokens(response.shareTokens);
        setSessionDocId(response.sessionDocId);
      });
    }
  };

  const updateQuestions = useCallback(
    (questions: TTagStore) => {
      if (selectedCategory === undefined || categories[selectedCategory] === undefined) {
        return;
      }

      const tmp = { ...categories };
      tmp[selectedCategory].questions = questions;
      setCategories(tmp);
    },
    [selectedCategory, categories]
  );

  useEffect(() => {
    if (shareTokens !== undefined) {
      const data = new Blob(
        [
          [
            'Berechtigung;Link',
            ...Object.entries(shareTokens).map(([token, group]) => `${group};https://demokratisch.app/r/${token}`),
          ].join('\n'),
        ],
        { type: 'text/plain' }
      );

      if (shareTokenFile !== undefined) {
        window.URL.revokeObjectURL(shareTokenFile);
      }

      setShareTokenFile(window.URL.createObjectURL(data));
    }
  }, [shareTokens]);

  console.log(categories[selectedCategory ?? '']);

  return (
    <div className="flex justify-center items-center bg-gray-400 min-h-screen w-full">
      <div className="flex flex-col space-y-10 bg-gray-100 rounded-xl justify-center items-center p-10 w-[1500px]">
        <H1>DemokraTisch erstellen</H1>

        <div className="grid grid-cols-6 p-2 rounded-lg bg-white w-full space-x-5">
          <div className="col-span-2">
            <TagEditor
              title="Kategorie"
              store={{
                tags: categories,
                setTags: setCategories as Dispatch<SetStateAction<TTagStore>>,
                selected: selectedCategory,
                setSelected: setSelectedCategory,
              }}
            />
          </div>
          <div className="col-span-4 ">
            <TagEditor
              title="Frage"
              store={{
                tags: selectedCategory ? categories[selectedCategory].questions ?? {} : {},
                setTags: updateQuestions,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-10">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <div className="flex flex-col w-full justify-center gap-x-5 gap-y-10">
                <TitledInput id="title" required type="text">
                  Titel des Demokratisch
                </TitledInput>
                <TitledInput id="logo" type="file">
                  Ihr Logo
                </TitledInput>
                <input
                  type="submit"
                  value="Senden"
                  className="border-2 border-purple text-purple bg-white hover:cursor-pointer font-medium py-5 rounded-lg"
                />
              </div>
            </form>
          </FormProvider>
        </div>

        {shareTokens && (
          <div className="grid grid-cols-2 gap-4 bg-white rounded-xl p-4">
            {Object.entries(shareTokens).map(([token, group]) => {
              return <div className="">{`${group}: https://demokratisch.app/r/${token}`}</div>;
            })}
          </div>
        )}

        <div>
          {shareTokenFile && (
            <a download={`DemokraTisch-${form.watch().title}-${sessionDocId}.csv`} href={shareTokenFile}>
              Session Zusammenfassung herunterladen
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Tag = (props: { onRemove: () => void; onSelect: () => void; value: string; selected?: boolean }) => {
  return (
    <div
      className={cn('flex w-full justify-between p-2 even:bg-gray-100 box-border border-2', {
        'border-purple': props.selected,
        'even:border-gray-100 border-white': !props.selected,
      })}
      key={props.value}
    >
      <div className="w-full whitespace-pre-line flex-grow cursor-pointer" onClick={() => props.onSelect()}>
        {props.value}
      </div>
      <XIcon onClick={() => props.onRemove()} className="w-6 h-6 cursor-pointer" />
    </div>
  );
};

const TagEditor = (props: {
  title: string;
  store: {
    tags: TTagStore;
    setTags: (store: TTagStore) => void;
    selected?: string | undefined;
    setSelected?: (key: string | undefined) => void;
  };
}) => {
  const form = useForm();
  const [inputId] = useState(randomString(10));
  const [alertVisible, setAlertVisible] = useState(false);
  const [selected, setSelected] = useState<string>();

  const { title, store } = props;

  const submit = (data: Record<string, string>) => {
    const tag = { value: data[inputId] };

    if (!tag) {
      return;
    }

    if (Object.values(store.tags).some(t => t.value === tag.value)) {
      return setAlertVisible(true);
    }

    const randomId = randomString(10);

    const tmp: TTagStore = {
      ...store.tags,
      [randomId]: tag,
    };

    store.setTags(tmp);

    form.setValue(inputId, '');

    setSelected(randomId);
    if (store.setSelected) {
      store.setSelected(randomId);
    }
  };

  const removeTag = (key: string) => {
    const tmp = { ...store.tags };
    delete tmp[key];
    store.setTags(tmp);

    if (store.setSelected && store.selected === key) {
      setSelected(undefined);
      store.setSelected(undefined);
    }
  };

  const onSelect = (key: string) => {
    setSelected(key);
    if (store.setSelected) {
      store.setSelected(key);
    }
  };

  return (
    <>
      <Alert
        title={`${title} existiert schon!`}
        text={`Diese ${title} existiert schon.`}
        onApprove={() => {}}
        open={alertVisible}
        setOpen={setAlertVisible}
      />

      <div className="h-full relative overflow-y-auto">
        <div className="sticky top-0">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
              <span>{props.title}</span>
              <div className="flex space-x-2">
                <Input type="text" id={inputId} />
                <button className="rounded-l-xl bg-white" onClick={form.handleSubmit(submit)}>
                  {Object.values(store.tags).some(({ value }) => form.watch()[inputId] == value) ? null : (
                    <PlusIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
              <div className="h-10 flex items-center justify-center">
                {Object.values(store.tags).some(({ value }) => form.watch()[inputId] == value) ? (
                  <div className="text-center">{`Diese ${title} existiert schon.`}</div>
                ) : null}
              </div>
            </form>
          </FormProvider>
        </div>
        <div className="flex flex-col p-2">
          {Object.entries(store.tags).map(([key, value], i) => {
            return (
              <Tag
                onRemove={() => removeTag(key)}
                onSelect={() => onSelect(key)}
                value={typeof value === 'string' ? value : value.value}
                key={key}
                selected={key === selected}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
