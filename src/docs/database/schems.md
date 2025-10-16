# Documentação do Banco de Dados - StiloWeb32

## Visão Geral

Sistema de gerenciamento médico que contempla agendamentos, consultas, pacientes, médicos, secretárias e convênios.

---

## Tabelas do Sistema

### 1. Tabelas de Sistema (sys\_)

#### sys_estado

Armazena os estados brasileiros.

| Campo    | Tipo         | Descrição                                |
| -------- | ------------ | ---------------------------------------- |
| estId    | int(10)      | Identificador único (PK, Auto-increment) |
| estSigla | varchar(4)   | Sigla do estado (ex: SP, RJ)             |
| estNome  | varchar(255) | Nome completo do estado                  |

#### sys_cidade

Armazena as cidades.

| Campo     | Tipo         | Descrição                                |
| --------- | ------------ | ---------------------------------------- |
| cddId     | int(10)      | Identificador único (PK, Auto-increment) |
| cddNome   | varchar(255) | Nome da cidade                           |
| cddEstado | int(10)      | Referência ao estado (FK)                |

**Relacionamentos:**

- `cddEstado` → `sys_estado.estId`

#### sys_integracao_confirmar_consulta

Log de confirmações de consulta via integração.

| Campo          | Tipo     | Descrição                 |
| -------------- | -------- | ------------------------- |
| nccAtendimento | int(10)  | Referência ao atendimento |
| nccEnviado     | datetime | Data/hora do envio        |
| nccConfirmado  | datetime | Data/hora da confirmação  |
| nccRemarcado   | datetime | Data/hora da remarcação   |

---

### 2. Tabelas de Dados (dad\_)

#### dad_usuario

Usuários do sistema administrativo.

| Campo               | Tipo         | Descrição                                |
| ------------------- | ------------ | ---------------------------------------- |
| usrId               | int(10)      | Identificador único (PK, Auto-increment) |
| usrNome             | varchar(255) | Nome do usuário                          |
| usrEmail            | varchar(255) | E-mail (UNIQUE)                          |
| usrSenha            | varchar(32)  | Senha (hash MD5)                         |
| usrPermissao        | text         | Permissões do usuário                    |
| usrNivel            | varchar(14)  | Nível de acesso (padrão: USUARIO)        |
| usrSituacao         | varchar(10)  | INATIVO/ATIVO (padrão: INATIVO)          |
| usrSecretaria       | int(10)      | Vinculação com secretária (FK, UNIQUE)   |
| usrMedico           | int(10)      | Vinculação com médico (FK, UNIQUE)       |
| usrAcessoData       | datetime     | Data do último acesso                    |
| usrAcessoQuantidade | decimal(20)  | Quantidade de acessos                    |
| usrAlteracaoData    | datetime     | Data da última alteração                 |
| usrAlteracaoUsuario | int(10)      | Usuário que fez a alteração (FK)         |

**Relacionamentos:**

- `usrMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `usrSecretaria` → `dad_secretaria.sctId` (CASCADE on DELETE)
- `usrAlteracaoUsuario` → `dad_usuario.usrId` (auto-referência)

#### dad_usuario_site

Usuários do portal web (pacientes).

| Campo               | Tipo         | Descrição                                |
| ------------------- | ------------ | ---------------------------------------- |
| usrId               | int(10)      | Identificador único (PK, Auto-increment) |
| usrNome             | varchar(255) | Nome do usuário                          |
| usrCNPJ             | varchar(18)  | CNPJ (para empresas)                     |
| usrCPF              | varchar(12)  | CPF (UNIQUE com CNPJ)                    |
| usrEmail            | varchar(255) | E-mail (UNIQUE)                          |
| usrSenha            | varchar(32)  | Senha (hash MD5)                         |
| usrSituacao         | varchar(10)  | INATIVO/ATIVO (padrão: INATIVO)          |
| usrPaciente         | int(10)      | Vinculação com paciente (FK, UNIQUE)     |
| usrAcessoData       | datetime     | Data do último acesso                    |
| usrAcessoQuantidade | decimal(20)  | Quantidade de acessos                    |
| usrAlteracaoData    | datetime     | Data da última alteração                 |
| usrAlteracaoUsuario | int(10)      | Usuário admin que fez a alteração (FK)   |

**Relacionamentos:**

- `usrPaciente` → `dad_paciente.pctId` (CASCADE on DELETE)
- `usrAlteracaoUsuario` → `dad_usuario.usrId`

#### dad_medico

Cadastro de médicos.

| Campo               | Tipo         | Descrição                                |
| ------------------- | ------------ | ---------------------------------------- |
| mdcId               | int(10)      | Identificador único (PK, Auto-increment) |
| mdcNome             | varchar(255) | Nome completo                            |
| mdcCPF              | varchar(12)  | CPF (UNIQUE)                             |
| mdcRG               | varchar(20)  | RG                                       |
| mdcNascimento       | varchar(10)  | Data de nascimento                       |
| mdcSexo             | varchar(10)  | Sexo                                     |
| mdcEndereco         | varchar(255) | Endereço                                 |
| mdcComplemento      | varchar(255) | Complemento                              |
| mdcNumero           | decimal(20)  | Número                                   |
| mdcBairro           | varchar(255) | Bairro                                   |
| mdcCEP              | varchar(9)   | CEP                                      |
| mdcCidade           | int(10)      | Cidade (FK)                              |
| mdcEstado           | int(10)      | Estado (FK)                              |
| mdcTelefone         | varchar(15)  | Telefone fixo                            |
| mdcCelular          | varchar(15)  | Celular                                  |
| mdcEmail            | varchar(255) | E-mail                                   |
| mdcCRM              | varchar(20)  | Número do CRM                            |
| mdcCRMEstado        | varchar(4)   | Estado do CRM                            |
| mdcObservacao       | text         | Observações                              |
| mdcSituacao         | varchar(10)  | INATIVO/ATIVO (padrão: INATIVO)          |
| mdcAlteracaoData    | datetime     | Data da última alteração                 |
| mdcAlteracaoUsuario | int(10)      | Usuário que fez a alteração (FK)         |
| mdcPixeOn           | varchar(20)  | Integração PixeOn (indexado)             |

**Relacionamentos:**

- `mdcCidade` → `sys_cidade.cddId`
- `mdcEstado` → `sys_estado.estId`
- `mdcAlteracaoUsuario` → `dad_usuario.usrId`

#### dad_secretaria

Cadastro de secretárias.

| Campo               | Tipo         | Descrição                                |
| ------------------- | ------------ | ---------------------------------------- |
| sctId               | int(10)      | Identificador único (PK, Auto-increment) |
| sctNome             | varchar(255) | Nome completo                            |
| sctCPF              | varchar(12)  | CPF (UNIQUE)                             |
| sctRG               | varchar(20)  | RG                                       |
| sctNascimento       | varchar(10)  | Data de nascimento                       |
| sctSexo             | varchar(10)  | Sexo                                     |
| sctEndereco         | varchar(255) | Endereço                                 |
| sctComplemento      | varchar(255) | Complemento                              |
| sctNumero           | decimal(20)  | Número                                   |
| sctBairro           | varchar(255) | Bairro                                   |
| sctCEP              | varchar(9)   | CEP                                      |
| sctCidade           | int(10)      | Cidade (FK)                              |
| sctEstado           | int(10)      | Estado (FK)                              |
| sctTelefone         | varchar(15)  | Telefone fixo                            |
| sctCelular          | varchar(15)  | Celular                                  |
| sctEmail            | varchar(255) | E-mail                                   |
| sctSituacao         | varchar(10)  | INATIVA/ATIVA (padrão: INATIVA)          |
| sctAlteracaoData    | datetime     | Data da última alteração                 |
| sctAlteracaoUsuario | int(10)      | Usuário que fez a alteração (FK)         |

**Relacionamentos:**

- `sctCidade` → `sys_cidade.cddId`
- `sctEstado` → `sys_estado.estId`
- `sctAlteracaoUsuario` → `dad_usuario.usrId`

#### dad_paciente

Cadastro de pacientes.

| Campo               | Tipo         | Descrição                                |
| ------------------- | ------------ | ---------------------------------------- |
| pctId               | int(10)      | Identificador único (PK, Auto-increment) |
| pctNome             | varchar(255) | Nome completo                            |
| pctCPF              | varchar(12)  | CPF (UNIQUE)                             |
| pctRG               | varchar(20)  | RG                                       |
| pctNascimento       | varchar(10)  | Data de nascimento                       |
| pctSexo             | varchar(10)  | Sexo                                     |
| pctEndereco         | varchar(255) | Endereço                                 |
| pctComplemento      | varchar(255) | Complemento                              |
| pctNumero           | decimal(20)  | Número                                   |
| pctBairro           | varchar(255) | Bairro                                   |
| pctCEP              | varchar(9)   | CEP                                      |
| pctCidade           | int(10)      | Cidade (FK)                              |
| pctEstado           | int(10)      | Estado (FK)                              |
| pctTelefone         | varchar(15)  | Telefone fixo                            |
| pctCelular          | varchar(15)  | Celular                                  |
| pctEmail            | varchar(255) | E-mail                                   |
| pctNomeMae          | varchar(255) | Nome da mãe                              |
| pctNomePai          | varchar(255) | Nome do pai                              |
| pctProfissao        | varchar(255) | Profissão                                |
| pctIndicacao        | varchar(18)  | Indicação                                |
| pctEstadoCivil      | varchar(14)  | Estado civil                             |
| pctCPFResponsavel   | varchar(12)  | CPF do responsável                       |
| pctSituacao         | varchar(10)  | INATIVO/ATIVO (padrão: INATIVO)          |
| pctAlteracaoData    | datetime     | Data da última alteração                 |
| pctAlteracaoUsuario | int(10)      | Usuário que fez a alteração (FK)         |
| pctPixeOn           | varchar(20)  | Integração PixeOn (indexado)             |

**Relacionamentos:**

- `pctCidade` → `sys_cidade.cddId`
- `pctEstado` → `sys_estado.estId`
- `pctAlteracaoUsuario` → `dad_usuario.usrId`

#### dad_convenio

Cadastro de convênios médicos.

| Campo               | Tipo         | Descrição                                |
| ------------------- | ------------ | ---------------------------------------- |
| cvnId               | int(10)      | Identificador único (PK, Auto-increment) |
| cvnNome             | varchar(255) | Nome do convênio (UNIQUE)                |
| cvnCredencial       | varchar(20)  | Credencial                               |
| cvnPagamentoOnline  | varchar(4)   | Permite pagamento online                 |
| cvnSituacao         | varchar(10)  | INATIVO/ATIVO (padrão: INATIVO)          |
| cvnAlteracaoData    | datetime     | Data da última alteração                 |
| cvnAlteracaoUsuario | int(10)      | Usuário que fez a alteração (FK)         |
| cvnPixeOn           | varchar(20)  | Integração PixeOn (indexado)             |

**Relacionamentos:**

- `cvnAlteracaoUsuario` → `dad_usuario.usrId`

#### dad_especialidade

Cadastro de especialidades médicas.

| Campo               | Tipo         | Descrição                                |
| ------------------- | ------------ | ---------------------------------------- |
| spcId               | int(10)      | Identificador único (PK, Auto-increment) |
| spcNome             | varchar(255) | Nome da especialidade (UNIQUE)           |
| spcSituacao         | varchar(10)  | INATIVA/ATIVA (padrão: INATIVA)          |
| spcAlteracaoData    | datetime     | Data da última alteração                 |
| spcAlteracaoUsuario | int(10)      | Usuário que fez a alteração (FK)         |
| spcPixeOn           | varchar(20)  | Integração PixeOn (indexado)             |

**Relacionamentos:**

- `spcAlteracaoUsuario` → `dad_usuario.usrId`

#### dad_cirurgia

Cadastro de tipos de cirurgia.

| Campo               | Tipo         | Descrição                                |
| ------------------- | ------------ | ---------------------------------------- |
| crgId               | int(10)      | Identificador único (PK, Auto-increment) |
| crgNome             | varchar(255) | Nome da cirurgia (UNIQUE)                |
| crgSituacao         | varchar(10)  | INATIVA/ATIVA (padrão: INATIVA)          |
| crgAlteracaoData    | datetime     | Data da última alteração                 |
| crgAlteracaoUsuario | int(10)      | Usuário que fez a alteração (FK)         |

**Relacionamentos:**

- `crgAlteracaoUsuario` → `dad_usuario.usrId`

#### dad_exame

Cadastro de tipos de exame.

| Campo               | Tipo         | Descrição                                |
| ------------------- | ------------ | ---------------------------------------- |
| exmId               | int(10)      | Identificador único (PK, Auto-increment) |
| exmNome             | varchar(255) | Nome do exame (UNIQUE)                   |
| exmSituacao         | varchar(10)  | INATIVO/ATIVO (padrão: INATIVO)          |
| exmAlteracaoData    | datetime     | Data da última alteração                 |
| exmAlteracaoUsuario | int(10)      | Usuário que fez a alteração (FK)         |

**Relacionamentos:**

- `exmAlteracaoUsuario` → `dad_usuario.usrId`

#### dad_indisponibilidade

Períodos de indisponibilidade dos médicos.

| Campo               | Tipo        | Descrição                                |
| ------------------- | ----------- | ---------------------------------------- |
| ndsId               | int(10)     | Identificador único (PK, Auto-increment) |
| ndsInicioData       | date        | Data de início                           |
| ndsInicioHora       | time        | Hora de início                           |
| ndsTerminoData      | date        | Data de término                          |
| ndsTerminoHora      | time        | Hora de término                          |
| ndsMedico           | int(10)     | Médico indisponível (FK)                 |
| ndsObservacao       | text        | Observações                              |
| ndsSituacao         | varchar(10) | INATIVA/ATIVA (padrão: INATIVA)          |
| ndsAlteracaoData    | datetime    | Data da última alteração                 |
| ndsAlteracaoUsuario | int(10)     | Usuário que fez a alteração (FK)         |

**Relacionamentos:**

- `ndsMedico` → `dad_medico.mdcId`
- `ndsAlteracaoUsuario` → `dad_usuario.usrId`

#### dad_atendimento

Registro de atendimentos/consultas.

| Campo                | Tipo          | Descrição                                |
| -------------------- | ------------- | ---------------------------------------- |
| tdmId                | int(10)       | Identificador único (PK, Auto-increment) |
| tdmData              | date          | Data do atendimento                      |
| tdmHora              | time          | Hora do atendimento                      |
| tdmMedico            | int(10)       | Médico responsável (FK)                  |
| tdmPaciente          | int(10)       | Paciente atendido (FK)                   |
| tdmValor             | decimal(20,2) | Valor do atendimento                     |
| tdmPagamentoTipo     | varchar(12)   | Tipo de pagamento                        |
| tdmPagamentoForma    | varchar(18)   | Forma de pagamento                       |
| tdmPagamentoSituacao | varchar(10)   | Situação do pagamento                    |
| tdmObservacao        | text          | Observações                              |
| tdmConfirmado        | varchar(4)    | Atendimento confirmado                   |
| tdmRetorno           | varchar(4)    | É retorno                                |
| tdmConvenio          | int(10)       | Convênio utilizado (FK)                  |
| tdmCirurgia          | int(10)       | Cirurgia realizada (FK)                  |
| tdmExame             | int(10)       | Exame realizado (FK)                     |
| tdmEspecialidade     | int(10)       | Especialidade do atendimento (FK)        |
| tdmServico           | varchar(10)   | Tipo de serviço                          |
| tdmSituacao          | varchar(14)   | Situação do atendimento                  |
| tdmAlteracaoData     | datetime      | Data da última alteração                 |
| tdmAlteracaoUsuario  | int(10)       | Usuário que fez a alteração              |
| tdmPixeOn            | varchar(20)   | Integração PixeOn (indexado)             |

**Relacionamentos:**

- `tdmMedico` → `dad_medico.mdcId`
- `tdmPaciente` → `dad_paciente.pctId`
- `tdmConvenio` → `dad_convenio.cvnId`
- `tdmCirurgia` → `dad_cirurgia.crgId`
- `tdmExame` → `dad_exame.exmId`
- `tdmEspecialidade` → `dad_especialidade.spcId`

---

### 3. Tabelas de Relacionamento (rlc\_)

#### rlc_medico_agenda

Agenda de atendimento dos médicos.

| Campo               | Tipo        | Descrição                                |
| ------------------- | ----------- | ---------------------------------------- |
| mgdRegistro         | int(10)     | Identificador único (PK, Auto-increment) |
| mgdMedico           | int(10)     | Médico (FK)                              |
| mgdSemana           | decimal(20) | Semana                                   |
| mgdPeriodo          | decimal(20) | Período                                  |
| mgdDiaSemana        | decimal(20) | Dia da semana (1-7)                      |
| mgdHorarioDe        | time        | Horário inicial                          |
| mgdHorarioAte       | time        | Horário final                            |
| mgdTempoAtendimento | time        | Duração do atendimento                   |

**Relacionamentos:**

- `mgdMedico` → `dad_medico.mdcId` (CASCADE on DELETE)

#### rlc_medico_agenda_especialidade

Especialidades atendidas por agenda.

| Campo            | Tipo    | Descrição          |
| ---------------- | ------- | ------------------ |
| mgsMedico        | int(10) | Médico (FK)        |
| mgsAgenda        | int(10) | Agenda (FK)        |
| mgsEspecialidade | int(10) | Especialidade (FK) |

**Constraint UNIQUE:** (mgsMedico, mgsAgenda, mgsEspecialidade)

**Relacionamentos:**

- `mgsMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `mgsAgenda` → `rlc_medico_agenda.mgdRegistro` (CASCADE on DELETE)
- `mgsEspecialidade` → `dad_especialidade.spcId`

#### rlc_medico_agenda_cirurgia

Cirurgias atendidas por agenda.

| Campo       | Tipo    | Descrição     |
| ----------- | ------- | ------------- |
| mgcMedico   | int(10) | Médico (FK)   |
| mgcAgenda   | int(10) | Agenda (FK)   |
| mgcCirurgia | int(10) | Cirurgia (FK) |

**Constraint UNIQUE:** (mgcMedico, mgcCirurgia, mgcAgenda)

**Relacionamentos:**

- `mgcMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `mgcAgenda` → `rlc_medico_agenda.mgdRegistro` (CASCADE on DELETE)
- `mgcCirurgia` → `dad_cirurgia.crgId`

#### rlc_medico_agenda_exame

Exames atendidos por agenda.

| Campo     | Tipo    | Descrição   |
| --------- | ------- | ----------- |
| mgxMedico | int(10) | Médico (FK) |
| mgxAgenda | int(10) | Agenda (FK) |
| mgxExame  | int(10) | Exame (FK)  |

**Constraint UNIQUE:** (mgxMedico, mgxExame, mgxAgenda)

**Relacionamentos:**

- `mgxMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `mgxAgenda` → `rlc_medico_agenda.mgdRegistro` (CASCADE on DELETE)
- `mgxExame` → `dad_exame.exmId`

#### rlc_medico_especialidade

Especialidades do médico.

| Campo            | Tipo    | Descrição          |
| ---------------- | ------- | ------------------ |
| mspMedico        | int(10) | Médico (FK)        |
| mspEspecialidade | int(10) | Especialidade (FK) |

**Constraint UNIQUE:** (mspMedico, mspEspecialidade)

**Relacionamentos:**

- `mspMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `mspEspecialidade` → `dad_especialidade.spcId`

#### rlc_medico_cirurgia

Cirurgias que o médico realiza.

| Campo       | Tipo    | Descrição     |
| ----------- | ------- | ------------- |
| mcrMedico   | int(10) | Médico (FK)   |
| mcrCirurgia | int(10) | Cirurgia (FK) |

**Constraint UNIQUE:** (mcrMedico, mcrCirurgia)

**Relacionamentos:**

- `mcrMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `mcrCirurgia` → `dad_cirurgia.crgId`

#### rlc_medico_exame

Exames que o médico realiza.

| Campo     | Tipo    | Descrição   |
| --------- | ------- | ----------- |
| mxmMedico | int(10) | Médico (FK) |
| mxmExame  | int(10) | Exame (FK)  |

**Constraint UNIQUE:** (mxmMedico, mxmExame)

**Relacionamentos:**

- `mxmMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `mxmExame` → `dad_exame.exmId`

#### rlc_medico_convenio

Convênios aceitos pelo médico.

| Campo       | Tipo    | Descrição     |
| ----------- | ------- | ------------- |
| mcvMedico   | int(10) | Médico (FK)   |
| mcvConvenio | int(10) | Convênio (FK) |

**Constraint UNIQUE:** (mcvMedico, mcvConvenio)

**Relacionamentos:**

- `mcvMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `mcvConvenio` → `dad_convenio.cvnId`

#### rlc_medico_convenio_agenda

Limite de atendimentos por convênio e dia.

| Campo                | Tipo        | Descrição              |
| -------------------- | ----------- | ---------------------- |
| mcgMedico            | int(10)     | Médico (FK)            |
| mcgConvenio          | int(10)     | Convênio (FK)          |
| mcgDiaSemana         | decimal(20) | Dia da semana          |
| mcgLimiteAtendimento | decimal(20) | Limite de atendimentos |

**Constraint UNIQUE:** (mcgMedico, mcgConvenio, mcgDiaSemana)

**Relacionamentos:**

- `mcgMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `mcgConvenio` → `dad_convenio.cvnId`

#### rlc_medico_convenio_especialidade_valor

Valores por especialidade e convênio.

| Campo            | Tipo          | Descrição          |
| ---------------- | ------------- | ------------------ |
| msvMedico        | int(10)       | Médico (FK)        |
| msvConvenio      | int(10)       | Convênio (FK)      |
| msvEspecialidade | int(10)       | Especialidade (FK) |
| msvValor         | decimal(20,2) | Valor cobrado      |

**Constraint UNIQUE:** (msvMedico, msvEspecialidade, msvConvenio)

**Relacionamentos:**

- `msvMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `msvConvenio` → `dad_convenio.cvnId`
- `msvEspecialidade` → `dad_especialidade.spcId`

#### rlc_medico_convenio_cirurgia_valor

Valores por cirurgia e convênio.

| Campo       | Tipo          | Descrição     |
| ----------- | ------------- | ------------- |
| mclMedico   | int(10)       | Médico (FK)   |
| mclConvenio | int(10)       | Convênio (FK) |
| mclCirurgia | int(10)       | Cirurgia (FK) |
| mclValor    | decimal(20,2) | Valor cobrado |

**Constraint UNIQUE:** (mclMedico, mclCirurgia, mclConvenio)

**Relacionamentos:**

- `mclMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `mclConvenio` → `dad_convenio.cvnId`
- `mclCirurgia` → `dad_cirurgia.crgId`

#### rlc_medico_convenio_exame_valor

Valores por exame e convênio.

| Campo       | Tipo          | Descrição     |
| ----------- | ------------- | ------------- |
| mxvMedico   | int(10)       | Médico (FK)   |
| mxvConvenio | int(10)       | Convênio (FK) |
| mxvExame    | int(10)       | Exame (FK)    |
| mxvValor    | decimal(20,2) | Valor cobrado |

**Constraint UNIQUE:** (mxvMedico, mxvExame, mxvConvenio)

**Relacionamentos:**

- `mxvMedico` → `dad_medico.mdcId` (CASCADE on DELETE)
- `mxvConvenio` → `dad_convenio.cvnId`
- `mxvExame` → `dad_exame.exmId`

#### rlc_paciente_convenio

Convênios do paciente.

| Campo        | Tipo        | Descrição            |
| ------------ | ----------- | -------------------- |
| pcvPaciente  | int(10)     | Paciente (FK)        |
| pcvConvenio  | int(10)     | Convênio (FK)        |
| pcvMatricula | varchar(20) | Número da matrícula  |
| pcvValidade  | varchar(10) | Validade do convênio |

**Constraint UNIQUE:** (pcvPaciente, pcvConvenio)

**Relacionamentos:**

- `pcvPaciente` → `dad_paciente.pctId` (CASCADE on DELETE)
- `pcvConvenio` → `dad_convenio.cvnId`

#### rlc_secretaria_medico

Relacionamento entre secretárias e médicos.

| Campo         | Tipo    | Descrição       |
| ------------- | ------- | --------------- |
| smdSecretaria | int(10) | Secretária (FK) |
| smdMedico     | int(10) | Médico (FK)     |

**Constraint UNIQUE:** (smdSecretaria, smdMedico)

**Relacionamentos:**

- `smdSecretaria` → `dad_secretaria.sctId` (CASCADE on DELETE)
- `smdMedico` → `dad_medico.mdcId`

#### rlc_usuario_site_paciente

Vinculação de usuários do site com pacientes.

| Campo       | Tipo    | Descrição               |
| ----------- | ------- | ----------------------- |
| upcUsuario  | int(10) | Usuário do sistema (FK) |
| upcPaciente | int(10) | Paciente (FK, UNIQUE)   |

**Relacionamentos:**

- `upcUsuario` → `dad_usuario.usrId` (CASCADE on DELETE)
- `upcPaciente` → `dad_paciente.pctId` (CASCADE on DELETE)

---

## Diagrama de Relacionamentos Principais

```
sys_estado
    └── sys_cidade
            ├── dad_medico
            ├── dad_secretaria
            └── dad_paciente

dad_usuario (administrativo)
    ├── dad_medico (1:1)
    ├── dad_secretaria (1:1)
    └── [auditoria de alterações]

dad_usuario_site (portal)
    └── dad_paciente (1:1)

dad_medico
    ├── rlc_medico_especialidade
    ├── rlc_medico_cirurgia
    ├── rlc_medico_exame
    ├── rlc_medico_convenio
    ├── rlc_medico_agenda
    └── dad_atendimento

dad_paciente
    ├── rlc_paciente_convenio
    └── dad_atendimento

dad_atendimento (central)
    ├── dad_medico
    ├── dad_paciente
    ├── dad_convenio
    ├── dad_especialidade
    ├── dad_cirurgia
    └── dad_exame
```

---

## Observações Importantes

### Convenções de Nomenclatura

- **Prefixos de tabelas:**
  - `sys_` - Tabelas de sistema
  - `dad_` - Tabelas de dados
  - `rlc_` - Tabelas de relacionamento

- **Prefixos de campos:**
  - 3 letras identificam a tabela (ex: `mdc` para médico)
  - Primeira letra maiúscula para o restante (ex: `mdcNome`)

### Campos de Auditoria

Todas as tabelas principais possuem:

- `[prefixo]AlteracaoData` - Data/hora da última modificação
- `[prefixo]AlteracaoUsuario` - Usuário que fez a modificação

### Campos de Situação

Indicam se o registro está ativo no sistema:

- `ATIVO/INATIVO` - Para registros gerais
- `ATIVA/INATIVA` - Para registros femininos

### Integração PixeOn

Campos `[prefixo]PixeOn` estão indexados para otimizar integrações externas.

### Delete Cascade

Relacionamentos importantes possuem `ON DELETE CASCADE` para manter integridade referencial automática.

---

## Índices

O sistema possui índices nas seguintes colunas:

- `dad_medico.mdcPixeOn`
- `dad_paciente.pctPixeOn`
- `dad_convenio.cvnPixeOn`
- `dad_especialidade.spcPixeOn`
- `dad_atendimento.tdmPixeOn`
- `sys_integracao_confirmar_consulta.nccAtendimento`

---

**Versão do Banco:** MySQL/MariaDB
**Schema:** stiloweb32
