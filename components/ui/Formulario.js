import styled from '@emotion/styled';

export const Formulario = styled.form`
  max-width:600px;
  width:95%;
  margin: 5rem auto 0 auto; 

  fieldset {
    margin: 2rem 0 ;
    border: 1px solid #e1e1e1;
    font-size: 2rem;
    padding: 2rem;
  }
`

export const Campo = styled.div`
  margin-bottom: 2rem;
  display:flex;
  align-items:center;

  label {
    flex: 0 0 150px;
    font-size:1.8rem;
  }

  input , textarea{
    flex: 1;
    padding:1rem;
  }

  textarea{
    min-height:150px
  }
`
export const InputSubmit = styled.input`
  background-color: var(--naranja);
  width: 100%;
  padding: 1.5rem;
  text-align: center;
  color: #fff;
  font-size: 1.8rem;
  text-transform:uppercase;
  border: none;
  font-family: 'PT Sans' sans-serif;
  font-weight: 700;
  border-radius: 3px;
  &:hover{
    cursor: pointer;
  }
`
export const Error = styled.p`
  display: block;
  ;
  max-width:450px;
  background-color: #f00b;
  padding: 1rem;
  font-family: 'PT Sans' sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  color: #fff;
  text-align: center;
  text-transform:uppercase;
  margin: -1rem 0 2rem 150px;
  border-radius: 3px;
`