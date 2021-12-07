import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import hooks from "ui/hooks";
import { WorkspaceSettings } from "ui/types";
import useDebounceState from "./useDebounceState";

const Label = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={classNames(className, "w-5/12 flex-shrink-0")}>
      <label>{children}</label>
    </div>
  );
};

const Input = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-8/12">{children}</div>;
};

const Row = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center">{children}</div>;
};

const OrganizationSettings = ({ workspaceId }: { workspaceId: string }) => {
  const { workspace } = hooks.useGetWorkspace(workspaceId);
  const updateWorkspaceSettings = hooks.useUpdateWorkspaceSettings();
  const [message, setMessage] = useDebounceState(workspace?.settings?.motd || undefined, motd =>
    updateWorkspaceSettings({
      variables: {
        workspaceId,
        motd,
      },
    })
  );

  const updateFeature = (features: Partial<WorkspaceSettings["features"]>) => {
    updateWorkspaceSettings({
      variables: {
        workspaceId,
        features,
      },
    });
  };

  if (!workspace) {
    return null;
  }

  const disabled = !workspace.isOrganization;

  return (
    <div className={classNames("space-y-4", { "text-gray-500": disabled })}>
      {disabled ? (
        <p>
          These features are only available to teams on our Organization Plan. Want to upgrade? Get
          in touch!
        </p>
      ) : null}
      <div className="text-xs uppercase font-semibold">Recordings</div>
      <Row>
        <Label>Disable Public Recordings</Label>
        <Input>
          <label className="flex items-center" htmlFor="disable_public_recordings">
            <input
              className={classNames("rounded-sm ml-0 text-sm", {
                "bg-toolbarBackground": disabled,
                "border-gray-300": disabled,
              })}
              disabled={disabled}
              type="checkbox"
              id="disable_public_recordings"
              name="disable_public_recordings"
              onChange={e => updateFeature({ recording: { public: !e.currentTarget.checked } })}
              checked={!workspace.settings.features.recording.public}
            />
          </label>
        </Input>
      </Row>
      {/* <Row>
        <Label>Allow Recordings From</Label>
        <Input>
          <input
            className={classNames("rounded-md mr-2 w-full text-sm", {
              "bg-toolbarBackground": disabled,
              "border-gray-300": disabled,
            })}
            disabled={disabled}
            placeholder={`staging.${workspace?.domain}`}
            type="text"
          />
        </Input>
      </Row>
      <Row>
        <Label>Block Recordings From</Label>
        <Input>
          <input
            disabled={disabled}
            placeholder={`production.${workspace?.domain}`}
            type="text"
            className={classNames("rounded-md w-full mr-2 text-sm", {
              "bg-toolbarBackground": disabled,
              "border-gray-300": disabled,
            })}
          />
        </Input>
      </Row> */}
      <div className="text-xs uppercase font-semibold">Members</div>
      <Row>
        <Label>Disable My Library</Label>
        <Input>
          <label className="flex items-center" htmlFor="restrict_users_to_domain">
            <input
              className={classNames("rounded-sm ml-0 text-sm", {
                "bg-toolbarBackground": disabled,
                "border-gray-300": disabled,
              })}
              disabled={disabled}
              type="checkbox"
              id="restrict_users_to_domain"
              name="restrict_users_to_domain"
              checked={!workspace.settings.features.user.library}
              onChange={e => updateFeature({ user: { library: !e.currentTarget.checked } })}
            />
          </label>
        </Input>
      </Row>
      {/* <Row>
        <Label>Limit users to {workspace?.domain}</Label>
        <Input>
          <label className="flex items-center" htmlFor="restrict_users_to_domain">
            <input
              className={classNames("rounded-sm ml-0 text-sm", {
                "bg-toolbarBackground": disabled,
                "border-gray-300": disabled,
              })}
              disabled={disabled}
              type="checkbox"
              id="restrict_users_to_domain"
              name="restrict_users_to_domain"
            />
          </label>
        </Input>
      </Row> */}
      <Row>
        <Label className="self-start">Welcome Message</Label>
        <div>
          <textarea
            className={classNames("rounded-md w-full h-20 text-sm", {
              "bg-toolbarBackground": disabled,
              "border-gray-300": disabled,
            })}
            disabled={disabled}
            onChange={e => setMessage(e.currentTarget.value)}
            value={message}
          />
          <a href="/browser/new-tab" rel="noreferrer noopener" target="_blank">
            Preview
          </a>
        </div>
      </Row>
    </div>
  );
};

export default OrganizationSettings;