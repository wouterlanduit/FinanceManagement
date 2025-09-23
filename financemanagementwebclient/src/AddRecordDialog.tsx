import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Label, type InputOnChangeData } from "@fluentui/react-components";
import { useState } from "react";

export type AddRecordDialogField<TRecord> = {
    name: string;
    type?: "date" | "number" | "text";
    required?: boolean;
    setValue: (dto: TRecord, valueStr: string) => void;
}

export interface IAddRecordDialogProps<TRecord> {
    _ISDEBUG_: boolean;
    fields: AddRecordDialogField<TRecord>[];
    initRecord: () => TRecord;
    createRecord: (dto: TRecord) => boolean;
}
function AddRecordDialog<TRecord>(props: IAddRecordDialogProps<TRecord>) {
    const [open, setOpen] = useState(false);

    const handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();

        // TODO validate

        if (props.createRecord(record)) {
            setOpen(false);
        }
    };

    const record: TRecord = props.initRecord();

    return <Dialog
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
                                    <Input
                                        required={field.required ?? false}
                                        type={field.type ?? "text"}
                                        id={field.name + "-input"}
                                        onChange={(_ev: React.ChangeEvent, data: InputOnChangeData) => { field.setValue(record, data.value) }}
                                    />
                                </>
                            ))
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" appearance="primary">
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
}

export default AddRecordDialog;