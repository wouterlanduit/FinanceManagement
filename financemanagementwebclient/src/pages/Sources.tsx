import SimpleGrid from "../components/SimpleGrid/SimpleGrid";
import { type DataSource } from "../services/data-source-service";
import type { SourceDTO } from '../models/source-dto';


export interface ISourcesProps {
    datasource: DataSource
}
function Sources(props: ISourcesProps) {
    return <div className="content">
        <h1>Sources</h1>
        <SimpleGrid<SourceDTO>
            source={props.datasource}
            _ISDEBUG_={window.location.hostname === 'localhost'}
            fetch={(ds: DataSource) => ds.loadSources()}
            columns={[
                {
                    name: "Name",
                    type: "text",
                    required: true,
                    setValue: (dto: SourceDTO, value: string) => {
                        dto.name = value;
                    },
                    renderValue: (item: SourceDTO) => {
                        return item.name;
                    },
                    compare: (a: SourceDTO, b: SourceDTO) => {
                        return a.name.localeCompare(b.name);
                    }
                }
            ]}
            initRecord={() => {
                return {
                    id: 0,
                    name: ""
                }
            }}
            createRecord={(record: SourceDTO) => props.datasource.addSource(record)}
            getRowId={(source: SourceDTO) => source.id}
        />
    </div>;
}

export default Sources;