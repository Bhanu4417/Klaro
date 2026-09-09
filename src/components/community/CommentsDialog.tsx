"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";

export interface DialogComment {
  id: string;
  authorId?: string;
  author: string;
  authorRole: string;
  avatar: string;
  timeAgo: string;
  text: string;
  replyTo?: { id: string; author: string };
}

export interface CommentsDialogPost {
  id: string;
  commentsCount: number;
  comments: DialogComment[];
}

interface CommentsDialogProps {
  post: CommentsDialogPost | null;
  inputValue: string;
  onInputChange: (v: string) => void;
  onSubmit: (replyTo?: { id: string; author: string }) => void;
  onClose: () => void;
  isOwnComment?: (c: DialogComment) => boolean;
  onDeleteComment?: (commentId: string) => void;
  placeholder?: string;
}

const isOfficialRole = (role?: string) => !!role && !/community/i.test(role);

export const CommentsDialog: React.FC<CommentsDialogProps> = ({
  post,
  inputValue,
  onInputChange,
  onSubmit,
  onClose,
  isOwnComment,
  onDeleteComment,
  placeholder,
}) => {
  const [replyTarget, setReplyTarget] = useState<{ id: string; author: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (inputValue === "" && textareaRef.current) textareaRef.current.style.height = "auto";
  }, [inputValue]);

  const send = () => {
    onSubmit(replyTarget ?? undefined);
    setReplyTarget(null);
  };

  return (
    <AnimatePresence>
      {post && (
        <div key="comments-dialog" className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B0B0D]/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-[#FCFCFB] border-[1.5px] border-[#D5D2D4] shadow-[0_24px_70px_rgba(0,0,0,0.28)] flex flex-col max-h-[68vh] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[#ECEAEB] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 tracking-tight">Join the conversation</h3>
                <p className="text-[10.5px] text-zinc-500 font-mono">
                  {post.commentsCount} comment{post.commentsCount === 1 ? "" : "s"} on this report
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-[#ECEAEB] active:scale-90 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={(el) => {
                if (el) el.scrollTop = el.scrollHeight;
              }}
              className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[80px]"
            >
              {post.comments.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6 font-medium">
                  No comments yet — start the conversation below.
                </p>
              ) : (
                <AnimatePresence initial={false}>
                  {post.comments
                    .filter((c) => !c.replyTo)
                    .map((comment) => (
                      <motion.div
                        key={comment.id}
                        layout
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="space-y-1.5"
                      >
                        <div className="p-2.5 rounded-xl bg-[#ECEAEB]/80 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <Avatar avatar={comment.avatar} name={comment.author} className="w-4 h-4 rounded-full text-[8px]" />
                              <span className="font-bold text-zinc-900 flex items-center gap-1">
                                {comment.author}
                                {isOfficialRole(comment.authorRole) && <ShieldCheck className="w-3 h-3 text-[#346415]" />}
                              </span>
                              <span className="text-[10px] text-zinc-500">({comment.authorRole})</span>
                            </div>
                            <span className="text-[10px] text-zinc-400">{comment.timeAgo}</span>
                          </div>
                          <p className="text-zinc-700 leading-relaxed pl-5">{comment.text}</p>
                          <div className="pl-5 flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => setReplyTarget({ id: comment.id, author: comment.author })}
                              className="text-[10px] font-bold text-[#346415] hover:underline"
                            >
                              Reply
                            </button>
                            {isOwnComment?.(comment) && onDeleteComment && (
                              <button
                                type="button"
                                onClick={() => onDeleteComment(comment.id)}
                                className="flex items-center gap-0.5 text-[10px] font-bold text-rose-600 hover:underline"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>

                        {post.comments
                          .filter((rc) => rc.replyTo?.id === comment.id)
                          .map((rc) => (
                            <motion.div
                              key={rc.id}
                              layout
                              initial={{ opacity: 0, y: -8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              className="ml-5 p-2.5 rounded-xl bg-white border border-[#ECEAEB] text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <Avatar avatar={rc.avatar} name={rc.author} className="w-3.5 h-3.5 rounded-full text-[7px]" />
                                  <span className="font-bold text-zinc-900 flex items-center gap-1">
                                    {rc.author}
                                    {isOfficialRole(rc.authorRole) && <ShieldCheck className="w-3 h-3 text-[#346415]" />}
                                  </span>
                                  <span className="text-[9.5px] text-[#346415] font-semibold">↳ @{rc.replyTo?.author}</span>
                                </div>
                                <span className="text-[10px] text-zinc-400">{rc.timeAgo}</span>
                              </div>
                              <p className="text-zinc-700 leading-relaxed pl-5">{rc.text}</p>
                              {isOwnComment?.(rc) && onDeleteComment && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteComment(rc.id)}
                                  className="pl-5 flex items-center gap-0.5 text-[10px] font-bold text-rose-600 hover:underline"
                                >
                                  Delete
                                </button>
                              )}
                            </motion.div>
                          ))}
                      </motion.div>
                    ))}
                </AnimatePresence>
              )}
            </div>

            <div className="px-3 py-3 border-t border-[#ECEAEB] space-y-2 shrink-0">
              {replyTarget && (
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#EAFBD9] border border-[#B8F27D] text-[10.5px] font-semibold text-[#346415]">
                  <span>Replying to @{replyTarget.author}</span>
                  <button type="button" onClick={() => setReplyTarget(null)} className="font-bold hover:underline">
                    cancel
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputValue}
                  onChange={(e) => {
                    onInputChange(e.target.value);
                    const el = e.target as HTMLTextAreaElement;
                    el.style.height = "auto";
                    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder={replyTarget ? `Reply to ${replyTarget.author}...` : placeholder || "Add to the conversation..."}
                  className="flex-1 resize-none px-3.5 py-2 rounded-xl bg-[#ECEAEB] border border-[#D5D2D4] text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[#94EC40]/30 focus:border-[#94EC40] focus-visible:ring-2 focus-visible:ring-[#94EC40]/30 focus-visible:border-[#94EC40] focus:bg-white focus-visible:bg-white transition-colors leading-relaxed"
                />
                <button
                  type="button"
                  onClick={send}
                  title="Send comment"
                  className="p-2 rounded-xl bg-[#94EC40] text-[rgb(18,18,18)] border border-[#80D42F] shadow-xs hover:bg-[#85DF32] active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5 stroke-black" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
