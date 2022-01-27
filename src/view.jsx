import ForgeUI, {useProductContext, CustomField, Text, Link} from "@forge/ui";

export const View = () => {
	const {
			extensionContext: { fieldValue },
	} = useProductContext();

	if (fieldValue == null) {
		return (
			<CustomField>
				<Text>
					None
				</Text>
			</CustomField>
		)
	}

	const {versions} = JSON.parse(fieldValue)

	if (versions && versions.length) {
		return (
			<CustomField>
					{versions.map(version => <Text><Link href={`/projects/${version.projectKey}/versions/${version.id}/tab/release-report-all-issues`} target="_blank">{version.label}</Link></Text>)}
			</CustomField>
		);
	}

	return (
		<CustomField>
			<Text>
				None
			</Text>
		</CustomField>
	)
};
