import SimpleGrid from "../components/SimpleGrid/SimpleGrid";
import { type DataSource } from "../services/data-source-service";


export interface ISourcesProps {
    datasource: DataSource
}
function Sources(props: ISourcesProps) {
    return <div className="content">
        <h1>Sources</h1>
        <SimpleGrid
            source={props.datasource}
            _ISDEBUG_={window.location.hostname === 'localhost'}
            fetch={(ds: DataSource) => ds.loadSources()}
        />
    </div>;
}

export default Sources;