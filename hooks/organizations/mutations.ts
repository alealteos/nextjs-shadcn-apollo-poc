import { gql } from '@apollo/client';

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      slug
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      id
      name
      slug
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id)
  }
`;

export const ADD_ORGANIZATION_ROLE = gql`
  mutation AddOrganizationRole($input: AddOrganizationRoleInput!) {
    addOrganizationRole(input: $input) {
      id
      organizationId
      roleId
      createdAt
      updatedAt
      role {
        id
        name
        description
      }
    }
  }
`;

export const REMOVE_ORGANIZATION_ROLE = gql`
  mutation RemoveOrganizationRole($input: RemoveOrganizationRoleInput!) {
    removeOrganizationRole(input: $input)
  }
`;

export const ADD_ORGANIZATION_TAG = gql`
  mutation AddOrganizationTag($input: AddOrganizationTagInput!) {
    addOrganizationTag(input: $input) {
      id
      organizationId
      tagId
      createdAt
      updatedAt
      tag {
        id
        name
        color
      }
    }
  }
`;

export const REMOVE_ORGANIZATION_TAG = gql`
  mutation RemoveOrganizationTag($input: RemoveOrganizationTagInput!) {
    removeOrganizationTag(input: $input)
  }
`;
