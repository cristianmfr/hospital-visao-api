create table stiloweb32.sys_estado
(
    estId    int(10) auto_increment
        primary key,
    estSigla varchar(4)   null,
    estNome  varchar(255) null
);

create table stiloweb32.sys_cidade
(
    cddId     int(10) auto_increment
        primary key,
    cddNome   varchar(255) null,
    cddEstado int(10)      null,
    constraint cddEstado
        foreign key (cddEstado) references stiloweb32.sys_estado (estId)
            on update cascade
);

create table stiloweb32.dad_medico
(
    mdcId               int(10) auto_increment
        primary key,
    mdcNome             varchar(255)                  null,
    mdcCPF              varchar(12)                   null,
    mdcRG               varchar(20)                   null,
    mdcNascimento       varchar(10)                   null,
    mdcSexo             varchar(10)                   null,
    mdcEndereco         varchar(255)                  null,
    mdcComplemento      varchar(255)                  null,
    mdcNumero           decimal(20)                   null,
    mdcBairro           varchar(255)                  null,
    mdcCEP              varchar(9)                    null,
    mdcCidade           int(10)                       null,
    mdcEstado           int(10)                       null,
    mdcTelefone         varchar(15)                   null,
    mdcCelular          varchar(15)                   null,
    mdcEmail            varchar(255)                  null,
    mdcCRM              varchar(20)                   null,
    mdcCRMEstado        varchar(4)                    null,
    mdcObservacao       text                          null,
    mdcSituacao         varchar(10) default 'INATIVO' null comment 'INATIVO/ATIVO',
    mdcAlteracaoData    datetime                      null,
    mdcAlteracaoUsuario int(10)                       null,
    mdcPixeOn           varchar(20)                   null,
    constraint `UNIQUE`
        unique (mdcCPF),
    constraint mdcCidade
        foreign key (mdcCidade) references stiloweb32.sys_cidade (cddId)
            on update cascade,
    constraint mdcEstado
        foreign key (mdcEstado) references stiloweb32.sys_estado (estId)
            on update cascade
);

create index mdcPixeOn
    on stiloweb32.dad_medico (mdcPixeOn);

create table stiloweb32.dad_secretaria
(
    sctId               int(10) auto_increment
        primary key,
    sctNome             varchar(255)                  null,
    sctCPF              varchar(12)                   null,
    sctRG               varchar(20)                   null,
    sctNascimento       varchar(10)                   null,
    sctSexo             varchar(10)                   null,
    sctEndereco         varchar(255)                  null,
    sctComplemento      varchar(255)                  null,
    sctNumero           decimal(20)                   null,
    sctBairro           varchar(255)                  null,
    sctCEP              varchar(9)                    null,
    sctCidade           int(10)                       null,
    sctEstado           int(10)                       null,
    sctTelefone         varchar(15)                   null,
    sctCelular          varchar(15)                   null,
    sctEmail            varchar(255)                  null,
    sctSituacao         varchar(10) default 'INATIVA' null comment 'INATIVA/ATIVA',
    sctAlteracaoData    datetime                      null,
    sctAlteracaoUsuario int(10)                       null,
    constraint `UNIQUE`
        unique (sctCPF),
    constraint sctCidade
        foreign key (sctCidade) references stiloweb32.sys_cidade (cddId)
            on update cascade,
    constraint sctEstado
        foreign key (sctEstado) references stiloweb32.sys_estado (estId)
            on update cascade
);

create table stiloweb32.dad_usuario
(
    usrId               int(10) auto_increment
        primary key,
    usrNome             varchar(255)                  null,
    usrEmail            varchar(255)                  not null,
    usrSenha            varchar(32)                   not null,
    usrPermissao        text                          null,
    usrNivel            varchar(14) default 'USUARIO' null,
    usrSituacao         varchar(10) default 'INATIVO' null comment 'INATIVO/ATIVO',
    usrSecretaria       int(10)                       null,
    usrMedico           int(10)                       null,
    usrAcessoData       datetime                      null,
    usrAcessoQuantidade decimal(20)                   null,
    usrAlteracaoData    datetime                      null,
    usrAlteracaoUsuario int(10)                       null,
    constraint `UNIQUE`
        unique (usrEmail),
    constraint UNIQUE_1
        unique (usrMedico),
    constraint UNIQUE_2
        unique (usrSecretaria),
    constraint usrAlteracaoUsuario
        foreign key (usrAlteracaoUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade,
    constraint usrMedico
        foreign key (usrMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade,
    constraint usrSecretaria
        foreign key (usrSecretaria) references stiloweb32.dad_secretaria (sctId)
            on update cascade on delete cascade
);

create table stiloweb32.dad_cirurgia
(
    crgId               int(10) auto_increment
        primary key,
    crgNome             varchar(255)                  null,
    crgSituacao         varchar(10) default 'INATIVA' null comment 'INATIVA/ATIVA',
    crgAlteracaoData    datetime                      null,
    crgAlteracaoUsuario int(10)                       null,
    constraint `UNIQUE`
        unique (crgNome),
    constraint crgAlteracaoUsuario
        foreign key (crgAlteracaoUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade
);

create table stiloweb32.dad_convenio
(
    cvnId               int(10) auto_increment
        primary key,
    cvnNome             varchar(255)                  null,
    cvnCredencial       varchar(20)                   null,
    cvnPagamentoOnline  varchar(4)                    null,
    cvnSituacao         varchar(10) default 'INATIVO' null comment 'INATIVO/ATIVO',
    cvnAlteracaoData    datetime                      null,
    cvnAlteracaoUsuario int(10)                       null,
    cvnPixeOn           varchar(20)                   null,
    constraint `UNIQUE`
        unique (cvnNome),
    constraint cvnAlteracaoUsuario
        foreign key (cvnAlteracaoUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade
);

create index cvnPixeOn
    on stiloweb32.dad_convenio (cvnPixeOn);

create table stiloweb32.dad_especialidade
(
    spcId               int(10) auto_increment
        primary key,
    spcNome             varchar(255)                  null,
    spcSituacao         varchar(10) default 'INATIVA' null comment 'INATIVA/ATIVA',
    spcAlteracaoData    datetime                      null,
    spcAlteracaoUsuario int(10)                       null,
    spcPixeOn           varchar(20)                   null,
    constraint `UNIQUE`
        unique (spcNome),
    constraint spcAlteracaoUsuario
        foreign key (spcAlteracaoUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade
);

create index spcPixeOn
    on stiloweb32.dad_especialidade (spcPixeOn);

create table stiloweb32.dad_exame
(
    exmId               int(10) auto_increment
        primary key,
    exmNome             varchar(255)                  null,
    exmSituacao         varchar(10) default 'INATIVO' null comment 'INATIVO/ATIVO',
    exmAlteracaoData    datetime                      null,
    exmAlteracaoUsuario int(10)                       null,
    constraint `UNIQUE`
        unique (exmNome),
    constraint exmAlteracaoUsuario
        foreign key (exmAlteracaoUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade
);

create table stiloweb32.dad_indisponibilidade
(
    ndsId               int(10) auto_increment
        primary key,
    ndsInicioData       date                          null,
    ndsInicioHora       time                          null,
    ndsTerminoData      date                          null,
    ndsTerminoHora      time                          null,
    ndsMedico           int(10)                       null,
    ndsObservacao       text                          null,
    ndsSituacao         varchar(10) default 'INATIVA' null comment 'INATIVA/ATIVA',
    ndsAlteracaoData    datetime                      null,
    ndsAlteracaoUsuario int(10)                       null,
    constraint ndsAlteracaoUsuario
        foreign key (ndsAlteracaoUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade,
    constraint ndsMedico
        foreign key (ndsMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade
);

alter table stiloweb32.dad_medico
    add constraint mdcAlteracaoUsuario
        foreign key (mdcAlteracaoUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade;

create table stiloweb32.dad_paciente
(
    pctId               int(10) auto_increment
        primary key,
    pctNome             varchar(255)                  null,
    pctCPF              varchar(12)                   null,
    pctRG               varchar(20)                   null,
    pctNascimento       varchar(10)                   null,
    pctSexo             varchar(10)                   null,
    pctEndereco         varchar(255)                  null,
    pctComplemento      varchar(255)                  null,
    pctNumero           decimal(20)                   null,
    pctBairro           varchar(255)                  null,
    pctCEP              varchar(9)                    null,
    pctCidade           int(10)                       null,
    pctEstado           int(10)                       null,
    pctTelefone         varchar(15)                   null,
    pctCelular          varchar(15)                   null,
    pctEmail            varchar(255)                  null,
    pctNomeMae          varchar(255)                  null,
    pctNomePai          varchar(255)                  null,
    pctProfissao        varchar(255)                  null,
    pctIndicacao        varchar(18)                   null,
    pctEstadoCivil      varchar(14)                   null,
    pctCPFResponsavel   varchar(12)                   null,
    pctSituacao         varchar(10) default 'INATIVO' null comment 'INATIVO/ATIVO',
    pctAlteracaoData    datetime                      null,
    pctAlteracaoUsuario int(10)                       null,
    pctPixeOn           varchar(20)                   null,
    constraint `UNIQUE`
        unique (pctCPF),
    constraint pctAlteracaoUsuario
        foreign key (pctAlteracaoUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade,
    constraint pctCidade
        foreign key (pctCidade) references stiloweb32.sys_cidade (cddId)
            on update cascade,
    constraint pctEstado
        foreign key (pctEstado) references stiloweb32.sys_estado (estId)
            on update cascade
);

create table stiloweb32.dad_atendimento
(
    tdmId                int(10) auto_increment
        primary key,
    tdmData              date           null,
    tdmHora              time           null,
    tdmMedico            int(10)        null,
    tdmPaciente          int(10)        null,
    tdmValor             decimal(20, 2) null,
    tdmPagamentoTipo     varchar(12)    null,
    tdmPagamentoForma    varchar(18)    null,
    tdmPagamentoSituacao varchar(10)    null,
    tdmObservacao        text           null,
    tdmConfirmado        varchar(4)     null,
    tdmRetorno           varchar(4)     null,
    tdmConvenio          int(10)        null,
    tdmCirurgia          int(10)        null,
    tdmExame             int(10)        null,
    tdmEspecialidade     int(10)        null,
    tdmServico           varchar(10)    null,
    tdmSituacao          varchar(14)    null,
    tdmAlteracaoData     datetime       null,
    tdmAlteracaoUsuario  int(10)        null,
    tdmPixeOn            varchar(20)    null,
    constraint tdmCirurgia
        foreign key (tdmCirurgia) references stiloweb32.dad_cirurgia (crgId)
            on update cascade,
    constraint tdmConvenio
        foreign key (tdmConvenio) references stiloweb32.dad_convenio (cvnId)
            on update cascade,
    constraint tdmEspecialidade
        foreign key (tdmEspecialidade) references stiloweb32.dad_especialidade (spcId)
            on update cascade,
    constraint tdmExame
        foreign key (tdmExame) references stiloweb32.dad_exame (exmId)
            on update cascade,
    constraint tdmMedico
        foreign key (tdmMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade,
    constraint tdmPaciente
        foreign key (tdmPaciente) references stiloweb32.dad_paciente (pctId)
            on update cascade
);

create index tdmPixeOn
    on stiloweb32.dad_atendimento (tdmPixeOn);

create index pctPixeOn
    on stiloweb32.dad_paciente (pctPixeOn);

alter table stiloweb32.dad_secretaria
    add constraint sctAlteracaoUsuario
        foreign key (sctAlteracaoUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade;

create table stiloweb32.dad_usuario_site
(
    usrId               int(10) auto_increment
        primary key,
    usrNome             varchar(255)                  null,
    usrCNPJ             varchar(18)                   null,
    usrCPF              varchar(12)                   null,
    usrEmail            varchar(255)                  null,
    usrSenha            varchar(32)                   not null,
    usrSituacao         varchar(10) default 'INATIVO' null comment 'INATIVO/ATIVO',
    usrPaciente         int(10)                       null,
    usrAcessoData       datetime                      null,
    usrAcessoQuantidade decimal(20)                   null,
    usrAlteracaoData    datetime                      null,
    usrAlteracaoUsuario int(10)                       null,
    constraint `UNIQUE`
        unique (usrEmail),
    constraint UNIQUE_1
        unique (usrCNPJ, usrCPF),
    constraint UNIQUE_2
        unique (usrPaciente),
    constraint usrAlteracaoUsuario_
        foreign key (usrAlteracaoUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade,
    constraint usrPaciente
        foreign key (usrPaciente) references stiloweb32.dad_paciente (pctId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_agenda
(
    mgdRegistro         int(10) auto_increment
        primary key,
    mgdMedico           int(10)     null,
    mgdSemana           decimal(20) null,
    mgdPeriodo          decimal(20) null,
    mgdDiaSemana        decimal(20) null,
    mgdHorarioDe        time        null,
    mgdHorarioAte       time        null,
    mgdTempoAtendimento time        null,
    constraint mgdMedico
        foreign key (mgdMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_agenda_cirurgia
(
    mgcMedico   int(10) null,
    mgcAgenda   int(10) null,
    mgcCirurgia int(10) null,
    constraint `UNIQUE`
        unique (mgcMedico, mgcCirurgia, mgcAgenda),
    constraint mgcAgenda
        foreign key (mgcAgenda) references stiloweb32.rlc_medico_agenda (mgdRegistro)
            on update cascade on delete cascade,
    constraint mgcCirurgia
        foreign key (mgcCirurgia) references stiloweb32.dad_cirurgia (crgId)
            on update cascade,
    constraint mgcMedico
        foreign key (mgcMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_agenda_especialidade
(
    mgsMedico        int(10) null,
    mgsAgenda        int(10) null,
    mgsEspecialidade int(10) null,
    constraint `UNIQUE`
        unique (mgsMedico, mgsAgenda, mgsEspecialidade),
    constraint mgsAgenda
        foreign key (mgsAgenda) references stiloweb32.rlc_medico_agenda (mgdRegistro)
            on update cascade on delete cascade,
    constraint mgsEspecialidade
        foreign key (mgsEspecialidade) references stiloweb32.dad_especialidade (spcId)
            on update cascade,
    constraint mgsMedico
        foreign key (mgsMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_agenda_exame
(
    mgxMedico int(10) null,
    mgxAgenda int(10) null,
    mgxExame  int(10) null,
    constraint `UNIQUE`
        unique (mgxMedico, mgxExame, mgxAgenda),
    constraint mgxAgenda
        foreign key (mgxAgenda) references stiloweb32.rlc_medico_agenda (mgdRegistro)
            on update cascade on delete cascade,
    constraint mgxExame
        foreign key (mgxExame) references stiloweb32.dad_exame (exmId)
            on update cascade,
    constraint mgxMedico
        foreign key (mgxMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_cirurgia
(
    mcrMedico   int(10) null,
    mcrCirurgia int(10) null,
    constraint `UNIQUE`
        unique (mcrMedico, mcrCirurgia),
    constraint mcrCirurgia
        foreign key (mcrCirurgia) references stiloweb32.dad_cirurgia (crgId)
            on update cascade,
    constraint mcrMedico
        foreign key (mcrMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_convenio
(
    mcvMedico   int(10) null,
    mcvConvenio int(10) null,
    constraint `UNIQUE`
        unique (mcvMedico, mcvConvenio),
    constraint mcvConvenio
        foreign key (mcvConvenio) references stiloweb32.dad_convenio (cvnId)
            on update cascade,
    constraint mcvMedico
        foreign key (mcvMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_convenio_agenda
(
    mcgMedico            int(10)     null,
    mcgConvenio          int(10)     null,
    mcgDiaSemana         decimal(20) null,
    mcgLimiteAtendimento decimal(20) null,
    constraint `UNIQUE`
        unique (mcgMedico, mcgConvenio, mcgDiaSemana),
    constraint mcgConvenio
        foreign key (mcgConvenio) references stiloweb32.dad_convenio (cvnId)
            on update cascade,
    constraint mcgMedico
        foreign key (mcgMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_convenio_cirurgia_valor
(
    mclMedico   int(10)        null,
    mclConvenio int(10)        null,
    mclCirurgia int(10)        null,
    mclValor    decimal(20, 2) null,
    constraint `UNIQUE`
        unique (mclMedico, mclCirurgia, mclConvenio),
    constraint mclCirurgia
        foreign key (mclCirurgia) references stiloweb32.dad_cirurgia (crgId)
            on update cascade,
    constraint mclConvenio
        foreign key (mclConvenio) references stiloweb32.dad_convenio (cvnId)
            on update cascade,
    constraint mclMedico
        foreign key (mclMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_convenio_especialidade_valor
(
    msvMedico        int(10)        null,
    msvConvenio      int(10)        null,
    msvEspecialidade int(10)        null,
    msvValor         decimal(20, 2) null,
    constraint `UNIQUE`
        unique (msvMedico, msvEspecialidade, msvConvenio),
    constraint msvConvenio
        foreign key (msvConvenio) references stiloweb32.dad_convenio (cvnId)
            on update cascade,
    constraint msvEspecialidade
        foreign key (msvEspecialidade) references stiloweb32.dad_especialidade (spcId)
            on update cascade,
    constraint msvMedico
        foreign key (msvMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_convenio_exame_valor
(
    mxvMedico   int(10)        null,
    mxvConvenio int(10)        null,
    mxvExame    int(10)        null,
    mxvValor    decimal(20, 2) null,
    constraint `UNIQUE`
        unique (mxvMedico, mxvExame, mxvConvenio),
    constraint mxvConvenio
        foreign key (mxvConvenio) references stiloweb32.dad_convenio (cvnId)
            on update cascade,
    constraint mxvExame
        foreign key (mxvExame) references stiloweb32.dad_exame (exmId)
            on update cascade,
    constraint mxvMedico
        foreign key (mxvMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_especialidade
(
    mspMedico        int(10) null,
    mspEspecialidade int(10) null,
    constraint `UNIQUE`
        unique (mspMedico, mspEspecialidade),
    constraint mspEspecialidade
        foreign key (mspEspecialidade) references stiloweb32.dad_especialidade (spcId)
            on update cascade,
    constraint mspMedico
        foreign key (mspMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_medico_exame
(
    mxmMedico int(10) null,
    mxmExame  int(10) null,
    constraint `UNIQUE`
        unique (mxmMedico, mxmExame),
    constraint mxmExame
        foreign key (mxmExame) references stiloweb32.dad_exame (exmId)
            on update cascade,
    constraint mxmMedico
        foreign key (mxmMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_paciente_convenio
(
    pcvPaciente  int(10)     null,
    pcvConvenio  int(10)     null,
    pcvMatricula varchar(20) null,
    pcvValidade  varchar(10) null,
    constraint `UNIQUE`
        unique (pcvPaciente, pcvConvenio),
    constraint pcvConvenio
        foreign key (pcvConvenio) references stiloweb32.dad_convenio (cvnId)
            on update cascade,
    constraint pcvPaciente
        foreign key (pcvPaciente) references stiloweb32.dad_paciente (pctId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_secretaria_medico
(
    smdSecretaria int(10) null,
    smdMedico     int(10) null,
    constraint `UNIQUE`
        unique (smdSecretaria, smdMedico),
    constraint smdMedico
        foreign key (smdMedico) references stiloweb32.dad_medico (mdcId)
            on update cascade,
    constraint smdSecretaria
        foreign key (smdSecretaria) references stiloweb32.dad_secretaria (sctId)
            on update cascade on delete cascade
);

create table stiloweb32.rlc_usuario_site_paciente
(
    upcUsuario  int(10) null,
    upcPaciente int(10) null,
    constraint `UNIQUE`
        unique (upcPaciente),
    constraint upcPaciente
        foreign key (upcPaciente) references stiloweb32.dad_paciente (pctId)
            on update cascade on delete cascade,
    constraint upcUsuario
        foreign key (upcUsuario) references stiloweb32.dad_usuario (usrId)
            on update cascade on delete cascade
);

create table stiloweb32.sys_integracao_confirmar_consulta
(
    nccAtendimento int(10)  null,
    nccEnviado     datetime null,
    nccConfirmado  datetime null,
    nccRemarcado   datetime null
);

create index nccAtendimento
    on stiloweb32.sys_integracao_confirmar_consulta (nccAtendimento);
