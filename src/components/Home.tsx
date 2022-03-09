import React, { useEffect, useMemo, useState } from "react"
import {
    Button,
    Center,
    Heading,
    Text,
    Icon,
    Input,
    ScaleFade,
    OrderedList,
    Divider,
    ListItem,
    Spinner,
    InputGroup, // Some Chakra components that might be usefull
    HStack,
    VStack,
    InputRightAddon,
    Box,
} from "@chakra-ui/react"
import { InputActionMeta, Select, SingleValue } from 'chakra-react-select'
import { Card } from '@components/design/Card'
import { searchSchoolDistricts, searchSchools, NCESDistrictFeatureAttributes, NCESSchoolFeatureAttributes } from "@utils/nces"


const Home: React.FC = () => {
    const [searching, setSearching] = React.useState(false)
    const [districtSearch, setDistrictSearch] = React.useState<NCESDistrictFeatureAttributes[]>([]);
    const [schoolSearch, setSchoolSearch] = React.useState<NCESSchoolFeatureAttributes[]>([]);

    const [searchingDistrict, setSearchingDistrict] = useState<boolean>(false)

    const [districtKeyword, setDistrictKeyword] = useState<string>("")
    const [schoolKeyword, setSchoolKeyword] = useState<string>("")

    const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null)
    const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)

    const [districtSelectValue, setDistrictSelectValue] = useState<{
        value: string;
        label: string;
    } | null>();
    const [schoolSelectValue, setSchoolSelectValue] = useState<{
        value: string;
        label: string;
    } | null>();

    const districtOptions = useMemo(() => districtSearch.map(district => ({
        value: district.LEAID,
        label: district.NAME,
    })), [districtSearch])

    const schoolOptions = useMemo(() => schoolSearch.map(school => ({
        value: school.FID.toString(),
        label: school.NAME!,
    })), [schoolSearch])
    
    const demo = async () => { // see console for api result examples
        setSearching(true)
        const demoDistrictSearch = await searchSchoolDistricts("Peninsula School District")
        setDistrictSearch(demoDistrictSearch)
        console.log("District example", demoDistrictSearch)

        const demoSchoolSearch = await searchSchools("k", demoDistrictSearch[1].LEAID)
        setSchoolSearch(demoSchoolSearch)
        console.log("School Example", demoSchoolSearch)
        setSearching(false)
    }

    const fetchDistricts = async () => {
        if (districtKeyword) {
            setSearchingDistrict(true)
            const newDistrictSearch = await searchSchoolDistricts(districtKeyword)

            setSearchingDistrict(false)
        
            setDistrictSearch(newDistrictSearch.slice(0, 100))
        }
    }

    const fetchSchools = async () => {
        if (selectedDistrictId) {
            const newSchoolSearch = await searchSchools(schoolKeyword, selectedDistrictId)
            
            setSchoolSearch(newSchoolSearch.slice(0, 100))
        }
    }

    // useEffect(() => {
    //     demo()
    // }, [])

    useEffect(() => {
        fetchDistricts()
    }, [districtKeyword])

    useEffect(() => {
        fetchSchools()
    }, [selectedDistrictId, schoolKeyword])

    const handleChangeDistrict = (newValue: SingleValue<{
        value: string;
        label: string;
    }>) => {
        if (!!newValue) {
            setDistrictSelectValue(newValue)
            setSelectedDistrictId(newValue.value)

            if (newValue.value !== selectedDistrictId) {
                setSelectedSchoolId(null)
                setSchoolSelectValue(null)
                setSchoolKeyword("")
            }
        }
    };

    const handleInputChangeDistrict = (newValue: string, actionMeta: InputActionMeta) => {
        if (actionMeta.action !== 'input-blur') {
            setDistrictKeyword(newValue)
        }
    }

    const handleChangeSchool = (newValue: SingleValue<{
        value: string;
        label: string;
    }>) => {
        if (!!newValue) {
            setSchoolSelectValue(newValue)
            setSelectedSchoolId(newValue.value)
        }
    }
    
    return (
        <Center padding="100px" height="90vh">
            <ScaleFade initialScale={0.9} in={true}>
                <Card variant="rounded" borderColor="blue">
                    <Heading>School Data Finder</Heading>
                    <Box width={'100%'}>
                        <Box>
                            <Select
                                name="districts"
                                options={districtOptions}
                                placeholder="Search districts"
                                closeMenuOnSelect={true}
                                value={districtSelectValue}
                                onChange={handleChangeDistrict}
                                onInputChange={handleInputChangeDistrict}
                                size="sm"
                            />
                        </Box>
                        <Box mt={'2'}>
                            <Select
                                name="schools"
                                options={schoolOptions}
                                placeholder="Search schools"
                                closeMenuOnSelect={true}
                                value={schoolSelectValue}
                                onChange={handleChangeSchool}
                                size="sm"
                            />
                        </Box>
                    </Box>
                </Card>
            </ScaleFade>
        </Center>
    );
};

export default Home