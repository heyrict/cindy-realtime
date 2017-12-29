import graphene
from graphene import relay

import sui_hei.schema


class Query(sui_hei.schema.Query, graphene.ObjectType):
    # This class extends all abstract apps level Queries and graphene.ObjectType
    node = relay.Node.Field()


class Mutation(sui_hei.schema.Mutation, graphene.ObjectType):
    # This class extends all abstract apps level Queries and graphene.ObjectType
    node = relay.Node.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
