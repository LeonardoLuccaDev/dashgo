import type { NextPage } from 'next';
import { Flex, Button, Stack } from '@chakra-ui/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../components/Form/Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatório')
})

const Home: NextPage = () => {
  const { register, formState, handleSubmit } = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const { errors } = formState

  const handleSignIn: SubmitHandler<FieldValues> = async (values) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(values)
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
    >
      <Flex
        as="form"
        w="100%"
        maxWidth="360"
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing={4}>
          {/*// @ts-ignore */}
          <Input type="email" label='E-mail' {...register('email', { required: true })} error={errors.email} />
          {/*// @ts-ignore */}
          <Input type="password" label='Senha' {...register('password', { required: true })} error={errors.password} />
        </Stack>

        <Button type='submit' mt={6} colorScheme="pink" size="lg" isLoading={formState.isSubmitting}>Entrar</Button>
      </Flex>
    </Flex>
  )
}

export default Home
