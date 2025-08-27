import React from "react";
import { Box, Step, StepLabel, Stepper, Typography, Skeleton } from "@mui/material";
import { FormatTimestampAsTime } from "../utils/time";

interface WorkflowStep {
    label: string;
    description: string;
    operator: string;
    operator_id: string;
    datetime?: string; // 新增的 datetime 字段
}

interface OrderWorkflowProps {
    workflow: WorkflowStep[] | null;
    loading?: boolean; // 加载状态标志
}

const OrderWorkflow: React.FC<OrderWorkflowProps> = ({ workflow, loading = false }) => {
    if (loading || !workflow) {
        return (
            <Box sx={{ width: "100%", padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                    订单流程
                </Typography>
                {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ marginBottom: 2 }}>
                        <Skeleton variant="text" width="60%" height={30} />
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="text" width="80%" height={20} />
                    </Box>
                ))}
            </Box>
        );
    }

    if (workflow.length === 0) {
        return (
            <Box sx={{ width: "100%", padding: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    暂无流程记录。
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", padding: 2 }}>
            <Stepper activeStep={workflow.length - 1} orientation="horizontal">
                {workflow.map((step, index) => (
                    <Step key={index}>
                        <StepLabel>
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                {step.label}
                            </Typography>
                        </StepLabel>
                        <Box sx={{ marginLeft: 2, marginTop: 1 }}>
                            {/* 展示 datetime 字段 */}
                            {step.datetime && (
                                <Typography variant="body2" sx={{ color: "#616161" }}>
                                    时间: {step.datetime}
                                </Typography>
                            )}
                            {/* 如果没有 datetime 字段，则回退到 description */}
                            {!step.datetime && step.description && (
                                <Typography variant="body2" sx={{ color: "#616161" }}>
                                    时间: {step.description}
                                </Typography>
                            )}
                            {/*兼容旧数据 datetime存储在 description */}

                            {/*如果同时存在datetime和description 说明数据字段已经更新，使用新字段展示数据*/}
                            {step.datetime && step.description && (
                                <Typography variant="body2" sx={{ color: "#616161" }}>
                                    描述: {step.description}
                                </Typography>
                            )}

                            {step.operator && (
                                <Typography variant="body2" sx={{ color: "#616161" }}>
                                    操作人: {step.operator}
                                </Typography>
                            )}
                        </Box>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default OrderWorkflow;