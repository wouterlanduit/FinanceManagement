import { Button, Combobox, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Label, type InputOnChangeData, Option, type SelectionEvents, type OptionOnSelectData } from "@fluentui/react-components";
import { useState } from "react";
import './AddRecordDialog.css'
import { FluentProvider, webDarkTheme } from '@fluentui/react-components';

export type AddRecordDialogField<TRecord> = {
    name: string;
    type?: "date" | "number" | "text" | "combobox";
    required?: boolean;
    setValue: (dto: TRecord, valueStr: string) => void;
    options?: { [id: string] : string };
}

export interface IAddRecordDialogProps<TRecord> {
    _ISDEBUG_: boolean;
    fields: AddRecordDialogField<TRecord>[];
    initRecord: () => TRecord;
    createRecord: (dto: TRecord) => Promise<boolean>;
}
function AddRecordDialog<TRecord>(props: IAddRecordDialogProps<TRecord>) {
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    const handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();

        // TODO validate
        setCreating(true);
        props.createRecord(record).then((created: boolean) => {
            if (created) {
                setOpen(false);
            }
            setCreating(false);
        });
    };

    const record: TRecord = props.initRecord();

    return <>
    <FluentProvider theme={webDarkTheme}>
    <Dialog
        modalType="non-modal"
        open={open}
        onOpenChange={(_ev, data) => setOpen(data.open)}
    >
        <DialogTrigger disableButtonEnhancement>
            <Button appearance="subtle">Create</Button>
        </DialogTrigger>
        <DialogSurface aria-describedby={undefined}>
            <form onSubmit={handleSubmit}>
                <DialogBody>
                    <DialogTitle>Dialog title</DialogTitle>
                    <DialogContent className="addrecorddialogcontent">
                        {
                            props.fields.map((field: AddRecordDialogField<TRecord>) => (
                                <>
                                    <Label required={field.required ?? false} htmlFor={field.name + "-input"}>{field.name + ":"}</Label>
                                    {field.type != "combobox" &&
                                        <Input
                                            required={field.required ?? false}
                                            type={field.type ?? "text"}
                                            id={field.name + "-input"}
                                            onChange={(_ev: React.ChangeEvent, data: InputOnChangeData) => { field.setValue(record, data.value) }}
                                        />
                                    }
                                    {field.type === "combobox" &&
                                        <Combobox
                                            required={field.required ?? false}
                                            id={field.name + "-input"}
                                            onOptionSelect={(_ev: SelectionEvents, data: OptionOnSelectData) => {
                                                field.setValue(record, data.optionValue ?? "");
                                            }}
                                            onActiveOptionChange={(_ev: React.SyntheticEvent|Event, data) => {
                                                field.setValue(record, data?.nextOption?.id ?? "");
                                            }}>
                                            {field.options != undefined && Object.keys(field.options!).map((option: string) => (
                                                <Option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {field.options![option]}
                                                </Option>
                                            ))}
                                        </Combobox>
                                    }
                                </>
                            ))
                        }
                    </DialogContent>
                        <DialogActions>
                            <Button type="submit" appearance="primary" disabled={ creating }>
                                Create
                            </Button>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Close</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </form>
        </DialogSurface>
    </Dialog>
        </FluentProvider>
    </>
}

export default AddRecordDialog;