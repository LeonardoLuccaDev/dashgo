import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { api } from "../../services/Axios";
import { queryClient } from "../../services/QueryClient";
import { useRouter } from "next/router";

const createUserFormSchema = yup.object().shape({
    name: yup.string().required('Nome obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha obrigatório').min(6, 'No mínimo 6 caracteres'),
    password_confirm: yup.string().oneOf([
        null,
        yup.ref('password')
    ], 'As senhas precisam ser iguais')
})

type CreateUserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function CreateUser() {
    const router = useRouter()

    const createUser = useMutation(async (user: FieldValues) => {
        const response = await api.post('users', {
            user: {
                ...user,
                created_at: new Date()
            }
        });

        return response.data.user;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('users')
        }
    });

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(createUserFormSchema)
    });

    const { errors } = formState

    const handleCreateUser: SubmitHandler<FieldValues> =async (values) => {
        await createUser.mutateAsync(values)

        router.push('/users')
    }

    return (
        <Box>
            <Header />

            <Flex w="100%" my={6} maxWidth={1480} mx="auto" px={6}>
                <Sidebar />

                <Box as="form" flex={1} borderRadius={8} bg="gray.800" p={[6, 8]} onSubmit={handleSubmit(handleCreateUser)}>
                    <Heading size={"lg"} fontWeight="normal">Criar Usuário</Heading>

                    <Divider my={6} borderColor="gray.700" />

                    <VStack spacing={[6, 8]}>
                        <SimpleGrid minChildWidth={"240px"} spacing="8" w="100%">
                            {/*// @ts-ignore */}
                            <Input label="Nome completo" {...register('name', { required: true })} error={errors.name}/>
                            {/*// @ts-ignore */}
                            <Input type={"email"} label="E-mail" {...register('email', { required: true })} error={errors.email}/>
                        </SimpleGrid>
                        <SimpleGrid minChildWidth={"240px"} spacing={[6, 8]} w="100%">
                            {/*// @ts-ignore */}
                            <Input type={"password"} label="Senha" {...register('password', { required: true })} error={errors.password}/>
                            {/*// @ts-ignore */}
                            <Input type={"password"} label="Confirmação de senha" {...register('password_confirm', { required: true })} error={errors.password_confirm}/>
                        </SimpleGrid>
                    </VStack>

                    <Flex mt="8" justifyContent={"flex-end"}>
                        <HStack>
                            <Link href="/users" passHref>
                                <Button as={"a"} colorScheme={"whiteAlpha"}>Cancelar</Button>
                            </Link>
                            <Button type="submit" isLoading={formState.isSubmitting} colorScheme={"pink"}>Salvar</Button>
                        </HStack>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}