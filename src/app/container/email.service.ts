import { Injectable } from '@angular/core';
import { DockstoreService } from './../shared/dockstore.service';
import { ExtendedDockstoreTool } from './../shared/models/ExtendedDockstoreTool';

@Injectable()
export class EmailService {
  constructor(private dockstoreService: DockstoreService) {}
  /**
   * Compose the href for an email
   * @param email The mailto address
   * @param subject The subject of the email
   * @param body The body of the the email
   */
  private static composeEmail(email: string, subject: string, body: string): string {
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  /**
   * This gets the email subject when the Request Access button is clicked
   * @param path The path of the tool whose access is being requested
   */
  private static getRequestEmailSubject(path: string): string {
    return encodeURI(`Dockstore Request for Access to ${path}`);
  }

  /**
   * This gets the email body when the Request Access button is clicked
   * @param path The path of the tool whose access is being requested
   * @param toolRegistry The tool registry (Quay.io, GitLab, etc) of the tool whose access is being requested
   */
  private static getRequestEmailBody(path: string, toolRegistry: string): string {
    return encodeURI(`I would like to request access to your Docker image ${path}. ` + `My user name on ${toolRegistry} is <username>`);
  }

  // Contact Author button methods
  /**
   * This gets the mailto address when the Contact Author button is clicked.    console.log(tool);
   * This method is mostly redundant, but keeping it to mirror the Request Access button methods and in case modifications are needed
   * @param email The tool author's email address
   */
  private static getInquiryEmailMailTo(email: string): string {
    return email;
  }

  /**
   * This gets the email subject when the Contact Author button is clicked
   * @param path The path of the tool whose access is being requested
   */
  private static getInquiryEmailSubject(path: string): string {
    return encodeURI(`Dockstore ${path} inquiry`);
  }

  /**
   * This gets the email body when the Contact Author button is clicked
   * This method is mostly redundant, but keeping it to mirror the Request Access button methods and in case modifications are needed
   */
  private static getInquiryEmailBody(): string {
    return '';
  }

  /**
   * Composes the href for the Request Access email
   * @param tool The tool to request access for
   */
  public composeRequestAccessEmail(tool: ExtendedDockstoreTool, imgProvider: string): string {
    const email = this.getRequestEmailMailTo(tool.tool_maintainer_email, tool.email);
    const subject = EmailService.getRequestEmailSubject(tool.tool_path);
    const body = EmailService.getRequestEmailBody(tool.tool_path, imgProvider);
    return EmailService.composeEmail(email, subject, body);
  }

  /**
   * Composes the href for the Contact Author email
   * @param tool The tool to contact author for
   */
  public composeContactAuthorEmail(tool: ExtendedDockstoreTool): string {
    const email = EmailService.getInquiryEmailMailTo(tool.email);
    const subject = EmailService.getInquiryEmailSubject(tool.tool_path);
    const body = EmailService.getInquiryEmailBody();
    return EmailService.composeEmail(email, subject, body);
  }

  // Request Access button methods
  /**
   * This gets the mailto address when the Request Access button is clicked
   * @param maintainerEmail The maintainer email
   * @param email The tool author's email address
   */
  private getRequestEmailMailTo(maintainerEmail: string, email: string): string {
    return this.dockstoreService.getRequestAccessEmail(maintainerEmail, email);
  }
}
