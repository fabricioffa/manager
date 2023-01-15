# migrar lastPayment para contracts?

    Se migro:
        PRO
            posso comparar na mesma tabela,
            possibilita multiplos contratos
        CONTRA
            perda de semântica?

    Se não migro:
        CONTRA
            tenho que usar raw query,
            normarmalizar valores,
            criar o tipo na mão,
            criar outro card,


Todo dia criar débitos
    query: todos os contratos
        where: 
            - não tenham um débito com vencimento para o dia { contract.dueDay/new Date().getMonth + 1 }  deste mês

    loop nos contratos:
        - cria débito

Todo dia atualiza débitos
    query: todos os débitos
        where: 
            - dueDate < new Date()
        include: 
            - contract:
                select:
                    - interest 
                    - arrears 
                    - rent

    loop nos débitos:
        - update amount: (rent * (contract.arreas/100)) + (rent * (contract.interest/100))



-
--------------------------------------------------------------------------------------------------------------------

        # data do vencimento: 
            se o dia de hoje é menor que o dia do vencimento: 
                - a data do vencimento será deste mês
            se o dia de hoje é maior que o dia do vencimento: 
                - a data do vencimento será do mÊs seguinte
        # valor


hoje: 17/04/22
vencimento: 16

teria que ter um débito de 16/05

se tenho um débito por mês:
    - tenho que atualizar os débitos todo dia 




    