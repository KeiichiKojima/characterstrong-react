import React, { useEffect, useMemo, useRef, useState } from "react"
import {
    Center,
    Heading,
    ScaleFade,
    Box,
} from "@chakra-ui/react"
import { InputActionMeta, Select, SingleValue } from 'chakra-react-select'
import { Card } from '@components/design/Card'
import { searchSchoolDistricts, searchSchools, NCESDistrictFeatureAttributes, NCESSchoolFeatureAttributes } from "@utils/nces"


const Home: React.FC = () => {
    const [districtSearch, setDistrictSearch] = React.useState<NCESDistrictFeatureAttributes[]>([])
    const [schoolSearch, setSchoolSearch] = React.useState<NCESSchoolFeatureAttributes[]>([])

    const [districtKeyword, setDistrictKeyword] = useState<string>("")
    const [schoolKeyword, setSchoolKeyword] = useState<string>("")

    const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null)

    const [districtSelectValue, setDistrictSelectValue] = useState<{
        value: string;
        label: string;
    } | null>()
    const [schoolSelectValue, setSchoolSelectValue] = useState<{
        value: string;
        label: string;
    } | null>()

    const timeoutId = useRef<NodeJS.Timeout>()

    const districtOptions = useMemo(() => districtSearch.map(district => ({
        value: district.LEAID,
        label: district.NAME,
    })), [districtSearch])

    const schoolOptions = useMemo(() => schoolSearch.map(school => ({
        value: school.FID.toString(),
        label: school.NAME!,
    })), [schoolSearch])

    const fetchDistricts = async () => {
        if (districtKeyword) {
            const newDistrictSearch = await searchSchoolDistricts(districtKeyword)
        
            setDistrictSearch(newDistrictSearch.slice(0, 100))
        }
    }

    const fetchSchools = async () => {
        if (selectedDistrictId) {
            const newSchoolSearch = await searchSchools(schoolKeyword, selectedDistrictId)
            
            setSchoolSearch(newSchoolSearch.slice(0, 100))
        }
    }

    useEffect(() => {
        if (typeof timeoutId.current !== 'undefined') {
            clearTimeout(timeoutId.current)
        }

        timeoutId.current = setTimeout(() => {
            fetchDistricts()
        }, 500)
    }, [districtKeyword])

    useEffect(() => {
        if (typeof timeoutId.current !== 'undefined') {
            clearTimeout(timeoutId.current)
        }

        timeoutId.current = setTimeout(() => {
            fetchSchools()
        }, 500)
    }, [selectedDistrictId, schoolKeyword])

    const handleChangeDistrict = (newValue: SingleValue<{
        value: string;
        label: string;
    }>) => {
        if (!!newValue) {
            setDistrictSelectValue(newValue)
            setSelectedDistrictId(newValue.value)

            if (newValue.value !== selectedDistrictId) {
                setSchoolSelectValue(null)
                setSchoolKeyword("")
            }
        }
    }

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
        }
    }

    const handleInputChangeSchool = (newValue: string, actionMeta: InputActionMeta) => {
        if (actionMeta.action !== 'input-blur') {
            setSchoolKeyword(newValue)
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
                                onInputChange={handleInputChangeSchool}
                                size="sm"
                            />
                        </Box>
                    </Box>
                </Card>
            </ScaleFade>
        </Center>
    )
}

export default Home
