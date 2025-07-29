import { gql } from '@apollo/client';

export const CREATE_TAG = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      id
      name
      color
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation UpdateTag($id: ID!, $input: UpdateTagInput!) {
    updateTag(id: $id, input: $input) {
      id
      name
      color
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id)
  }
`;

export const ADD_USER_TAG = gql`
  mutation AddUserTag($input: AddUserTagInput!) {
    addUserTag(input: $input) {
      id
      userId
      tagId
      createdAt
      updatedAt
      user {
        id
        name
      }
      tag {
        id
        name
        color
      }
    }
  }
`;

export const REMOVE_USER_TAG = gql`
  mutation RemoveUserTag($input: RemoveUserTagInput!) {
    removeUserTag(input: $input)
  }
`;

export const ADD_ROLE_TAG = gql`
  mutation AddRoleTag($input: AddRoleTagInput!) {
    addRoleTag(input: $input) {
      id
      roleId
      tagId
      createdAt
      updatedAt
      role {
        id
        name
      }
      tag {
        id
        name
        color
      }
    }
  }
`;

export const REMOVE_ROLE_TAG = gql`
  mutation RemoveRoleTag($input: RemoveRoleTagInput!) {
    removeRoleTag(input: $input)
  }
`;

export const ADD_GROUP_TAG = gql`
  mutation AddGroupTag($input: AddGroupTagInput!) {
    addGroupTag(input: $input) {
      id
      groupId
      tagId
      createdAt
      updatedAt
      group {
        id
        name
      }
      tag {
        id
        name
        color
      }
    }
  }
`;

export const REMOVE_GROUP_TAG = gql`
  mutation RemoveGroupTag($input: RemoveGroupTagInput!) {
    removeGroupTag(input: $input)
  }
`;
