import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Label } from "@fluentui/react-components";

export type AddRecordDialogField<TRecord, TField> = {
    name: string;
    type?: "date" | "number" | "text";
    setValue: (dto: TRecord, value: TField) => void;
}

export interface IAddRecordDialogProps<TRecord> {
    _ISDEBUG_: boolean;
    fields: AddRecordDialogField<TRecord, never>[];
    initRecord: () => TRecord;
    createRecord: (dto: TRecord) => void;
}
function AddRecordDialog<TRecord>(props: IAddRecordDialogProps<TRecord>) {
    const handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        const record: TRecord = props.initRecord();

        // TODO call all setValue

        props.createRecord(record);
    };

    return <Dialog modalType="non-modal">
        <DialogTrigger disableButtonEnhancement>
            <Button>Create</Button>
        </DialogTrigger>
        <DialogSurface aria-describedby={undefined}>
            <form onSubmit={handleSubmit}>
                <DialogBody>
                    <DialogTitle>Dialog title</DialogTitle>
                    <DialogContent className="addrecorddialogcontent">
                        {
                            // TODO why are these fields not shown??
                            props.fields.map((field: AddRecordDialogField<TRecord, never>) => {
                                <>
                                    <Label required htmlFor={field.name + "-input"}>{field.name + ":"}</Label>
                                    <Input required type={field.type ?? "text"} id={field.name + "-input"} />
                                </>
                            })

                        }
                        <Label>{"TEST:"}</Label>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" appearance="primary">
                            Submit
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