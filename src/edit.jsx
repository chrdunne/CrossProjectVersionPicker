import ForgeUI, { 
  useProductContext,
  CustomFieldEdit, 
  Select, 
  Option,
  Fragment,
  useState,
  useEffect
} from "@forge/ui";
import api, { route } from "@forge/api";

const config = {
    headers: {
        'Accept': 'application/json'
    }
}

export const Edit = () => {
    const onSubmit = (formValue) => {
        return JSON.stringify(formValue)
    }

    const {
        extensionContext: { fieldValue },
    } = useProductContext();

    const selectedValues = JSON.parse(fieldValue)?.versions

    const [versions, setVersions] = useState([])
    const [projects, setProjects] = useState([])

    useEffect(async () => {
        const res = await api.asApp().requestJira(route`/rest/api/3/project/search?typeKey=software`, config);
        const data = await res.json();

        setProjects(data.values)

        const promises = data.values.map(item => api.asApp().requestJira(route`/rest/api/3/project/${item.id}/version?maxResults=1000`, config))
    
        await Promise.all(promises)
        .then(results => Promise.all(results.map(r => r.json())) )
        .then(resp => resp.map(project => project.values).flat())
        .then(resp => setVersions(resp))
    }, [])

    return (
            <CustomFieldEdit onSubmit={onSubmit} header="Cross Project Version Picker" width="medium" >
                    <Fragment>
                            <Select label="Versions" name="versions" isRequired isMulti>
                                    {
                                        versions.map(version => {
                                            const label = projects.find(item => item.id == version.projectId)?.key + ' - ' + version.name + ' ' + (version.archived ? '(Archived)': version.released ? '(Released)' : '(Unrealesed)')
                                            return (
                                                <Option
                                                    defaultSelected={selectedValues && selectedValues.find(item => item.id === version.id)}
                                                    label={label}
                                                    value={{
                                                        label: label, 
                                                        id: version.id,
                                                        projectKey: projects.find(item => item.id == version.projectId)?.key 
                                                    }}
                                                />
                                            )
                                        })
                                    }
                            </Select>
                    </Fragment>
            </CustomFieldEdit>
    );
};
